import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import JwtUtils from '../../utils/JwtUtils';
import { app } from '../../app';
import SequelizeUser from '../../database/models/SequelizeUser';
import SequelizeEvent from '../../database/models/SequelizeEvent';
import { validNewUser } from '../mocks/userMocks';
import { validEvents } from '../mocks/eventMocks';
import { emailQueue } from '../../services/QueueService';
import SequelizeTicket from '../../database/models/SequelizeTicket';
import { validTickets } from '../mocks/ticketsMocks';

chai.use(chaiHttp);
const { expect } = chai;

const route = '/admin';

describe('Admin /inviteUser/:userId/:eventId route', function () {
  beforeEach(function () { sinon.restore() });
  it('Should return 401 if the user is not an admin', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'user', email: 'user@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'user', email: 'user@email' });
    const res = await chai.request(app).post(`${route}/inviteUser/1/1`).set('Authorization', 'user token').send({ visitor: 'Valid visitor' });
    expect(res.status).to.be.equal(401);
    expect(res.body).to.deep.eq({ message: 'Unauthorized' });
  });
  it('Should return 400 if user id is not a number', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/inviteUser/abc/1`).set('Authorization', 'admin token').send({ visitor: 'Valid visitor' });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid params' });
  });
  it('Should return 400 if eventId is not a number', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/inviteUser/1/abc`).set('Authorization', 'admin token').send({ visitor: 'Valid visitor' });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid params' });
  });
  it('Should return 404 if the user is not found', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeUser, 'findByPk').resolves(null);
    const res = await chai.request(app).post(`${route}/inviteUser/999/1`).set('Authorization', 'admin token').send({ visitor: 'Valid visitor' });
    expect(res.status).to.be.equal(404);
    expect(res.body).to.deep.eq({ message: 'User not found' });
  });
  it('Should return 404 if the event is not found', async function () {
    const builtUser = SequelizeUser.build(validNewUser);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeUser, 'findByPk').resolves(builtUser);
    sinon.stub(SequelizeEvent, 'findByPk').resolves(null);
    const res = await chai.request(app).post(`${route}/inviteUser/1/999`).set('Authorization', 'admin token').send({ visitor: 'Valid visitor' });
    expect(res.status).to.be.equal(404);
    expect(res.body).to.deep.eq({ message: 'Event not found' });
  });
  it('Should return 401 if the event is open', async function () {
    const builtUser = SequelizeUser.build(validNewUser);
    const builtEvent = SequelizeEvent.build(validEvents[0]);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeUser, 'findByPk').resolves(builtUser);
    sinon.stub(SequelizeEvent, 'findByPk').resolves(builtEvent);
    const res = await chai.request(app).post(`${route}/inviteUser/1/1`).set('Authorization', 'admin token').send({ visitor: 'Valid visitor' });
    expect(res.status).to.be.equal(401);
    expect(res.body).to.deep.eq({ message: 'Event is not closed. Acquire it through /buytickets route' });
  });
  it('Should return 200 if the invite is successful', async function () {
    const builtUser = SequelizeUser.build(validNewUser);
    const builtEvent = SequelizeEvent.build(validEvents[1]);
    const builtTicket = SequelizeTicket.build(validTickets[0]);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(emailQueue, 'add').resolves();
    sinon.stub(SequelizeUser, 'findByPk').resolves(builtUser);
    sinon.stub(SequelizeEvent, 'findByPk').resolves(builtEvent);
    sinon.stub(SequelizeTicket, 'create').resolves(builtTicket);
    const res = await chai.request(app).post(`${route}/inviteUser/1/1`).set('Authorization', 'admin token').send({ visitor: 'Valid visitor' });
    expect(res.status).to.be.equal(201);
    expect(res.body).to.deep.eq(builtTicket.dataValues);
  });
});