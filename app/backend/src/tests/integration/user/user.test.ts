import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import { Response } from 'superagent';
// @ts-ignore
import chaiHttp = require('chai-http');

import JwtUtils from '../../../utils/JwtUtils';
import { app } from '../../../app';
import SequelizeUser from '../../../database/models/SequelizeUser';

import { validNewUser } from '../../mocks/userMocks';

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
  it('Should return 400 if the user does not exist or the password is invalid', async function () {
    sinon.stub(SequelizeUser, 'findOne').resolves(null);
    const res = await chai.request(app).post(`${route}/login`).send({
      email: 'email@example.com',
      password: 'password',
    });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Wrong username or password' });
  });
  it('Should return 200 if the user exists', async function () {
    const builtUser = SequelizeUser.build(validNewUser);
    sinon.stub(SequelizeUser, 'findOne').resolves(builtUser);
    const res = await chai.request(app).post(`${route}/login`).send({ email: 'valid@email.com', password: 'validPassword' });
    expect(res.status).to.be.equal(200);
    expect(res.body).to.haveOwnProperty('token');
  });
});