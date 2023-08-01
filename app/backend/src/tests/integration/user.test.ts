import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import { Response } from 'superagent';
// @ts-ignore
import chaiHttp = require('chai-http');

import JwtUtils from '../../utils/JwtUtils';
import { app } from '../../app';
import SequelizeUser from '../../database/models/SequelizeUser';

import { validNewUser } from '../mocks/userMocks';
import { emailQueue } from '../../services/QueueService';

chai.use(chaiHttp);
const { expect } = chai;

const route = '/user'

describe('User /login route', function () {
  beforeEach(function () { sinon.restore() });
  it('Should return 400 if the email is not provided', async function () {
    const res = await chai.request(app).post(`${route}/login`).send({
      password: 'password',
    });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Missing required fields' });
  });
  it('Should return 400 if the username is not provided', async function () {
    const res = await chai.request(app).post(`${route}/login`).send({
      email: 'email@example.com',
    });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Missing required fields' });
  });
  it('Should return 400 if the email is invalid', async function () {
    const res = await chai.request(app).post(`${route}/login`).send({
      email: 'email',
      password: 'password',
    });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid email address' });
  });
  it('Should return 400 if the password is invalid', async function () {
    const res = await chai.request(app).post(`${route}/login`).send({
      email: 'email@example.com',
      password: 'pass',
    });
    expect(res.status).to.be.eq(400);
    expect(res.body).to.deep.eq({ message: 'Password must be at least 6 characters long' });
  });
  it('Should return 400 if the user does not exist', async function () {
    sinon.stub(SequelizeUser, 'findOne').resolves(null);
    const res = await chai.request(app).post(`${route}/login`).send({
      email: 'email@example.com',
      password: 'password',
    });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid username or password' });
  });
  it('Should return 400 if the password is not crypted', async function () {
    const builtUser = SequelizeUser.build(validNewUser);
    sinon.stub(SequelizeUser, 'findOne').resolves(builtUser);
    const res = await chai.request(app).post(`${route}/login`).send({
      email: 'valid@email.com',
      password: 'invalidPassword',
    });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid username or password' });
  });
  it('Should return 200 if the user exists', async function () {
    const builtUser = SequelizeUser.build(validNewUser);
    sinon.stub(SequelizeUser, 'findOne').resolves(builtUser);
    sinon.stub(bcrypt, 'compareSync').returns(true);
    const res = await chai.request(app).post(`${route}/login`).send({ email: 'valid@email.com', password: 'validPassword' });
    expect(res.status).to.be.equal(200);
    expect(res.body).to.haveOwnProperty('token');
  });
});

describe('User /signup route', function () {
  beforeEach(function () { sinon.restore() });
  it('Should return 400 if the username is not provided', async function () {
    const res = await chai.request(app).post(`${route}/signup`).send({
      email: 'email@example.com',
      password: 'password',
    });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Missing required fields' });
  });
  it('Should return 400 if the email already exists', async function () {
    const builtUser = SequelizeUser.build(validNewUser);
    sinon.stub(SequelizeUser, 'findOne').resolves(builtUser);
    const res = await chai.request(app).post(`${route}/signup`).send({
      username: 'user',
      email: 'email@example.com',
      password: 'password',
    });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'User already exists' });
  });
  it('Should return 201 if the user is created', async function () {
    const builtUser = SequelizeUser.build(validNewUser);
    sinon.stub(SequelizeUser, 'findOne').resolves(null);
    sinon.stub(SequelizeUser, 'create').resolves(builtUser);
    sinon.stub(bcrypt, 'hashSync').resolves('validPassword');
    sinon.stub(emailQueue, 'add').resolves();
    const res = await chai.request(app).post(`${route}/signup`).send({
      username: 'Valid User',
      email: 'valid@example.com',
      password: 'validPassword',
    });
    expect(res.status).to.be.equal(201);
    expect(res.body).to.deep.eq({message: `Valid User account was created. Access valid@example.com and click on the link to activate your account`});
  });
})

describe('User /activate/:userId/:activationCode route', function () {
  beforeEach(function () { sinon.restore() });
  it('Should return 400 if the userId is invalid', async function () {
    const res = await chai.request(app).get(`${route}/activate/a/123`);
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid userId' });
  });
  it('Should return 404 if the user is not found', async function () {
    sinon.stub(SequelizeUser, 'findByPk').resolves(null);
    const res = await chai.request(app).get(`${route}/activate/10/123`);
    expect(res.status).to.be.equal(404);
    expect(res.body).to.deep.eq({ message: 'User not found' });
  });
  it('Should return 400 if the activation code is invalid', async function () {
    const builtUser = SequelizeUser.build(validNewUser);
    sinon.stub(SequelizeUser, 'findByPk').resolves(builtUser);
    const res = await chai.request(app).get(`${route}/activate/1/123`);
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid activation code' });
  });
  it('Should return 200 if the user is activated', async function () {
    const builtUser = SequelizeUser.build(validNewUser);
    sinon.stub(SequelizeUser, 'findByPk').resolves(builtUser);
    sinon.stub(SequelizeUser, 'update').resolves();
    const res = await chai.request(app).get(`${route}/activate/1/validCode`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.deep.eq({ message: 'Account activated successfully' });
  })
})