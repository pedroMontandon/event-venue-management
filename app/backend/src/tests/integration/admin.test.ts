import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import JwtUtils from '../../utils/JwtUtils';
import { app } from '../../app';
import SequelizeUser from '../../database/models/SequelizeUser';
import SequelizeEvent from '../../database/models/SequelizeEvent';
import { validNewUser } from '../mocks/userMocks';
import { returnedEvents, validEvents } from '../mocks/eventMocks';
import { emailQueue } from '../../services/QueueService';
import SequelizeTicket from '../../database/models/SequelizeTicket';
import { sameEventTickets, validTickets } from '../mocks/ticketsMocks';

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

describe('Admin /createEvent route', function () {
  beforeEach(function () { sinon.restore() });
  it('Should return 400 if there is no eventName', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/createEvent`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Missing required fields' });
  });
  it('Should return 400 if there is no description', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/createEvent`).set('Authorization', 'admin token').send({ eventName: 'Valid name', description: '' });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Missing required fields' });
  });
  it('Should return 400 if there is no date', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/createEvent`).set('Authorization', 'admin token').send({ eventName: 'Valid name', description: 'Valid description', date: '' });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Missing required fields' });
  });
  it('Should return 400 if the eventName length is less than 3', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/createEvent`).set('Authorization', 'admin token').send({ eventName: 'Iv', description: 'Valid description', date: "2023-08-01T16:44:38.149Z" });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Event name must be at least 3 characters long' });
  });
  it('Should return 400 if the description length is less than 3', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/createEvent`).set('Authorization', 'admin token').send({ eventName: 'Valid name', description: 'Iv', date: "2023-08-01T16:44:38.149Z" });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Event description must be at least 10 characters long' });
  });
  it('Should return 400 if the date is invalid', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/createEvent`).set('Authorization', 'admin token').send({ eventName: 'Valid name', description: 'Valid description', date: 'Invalid date' });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid date format' });
  });
  it('Should return 400 if there is no price', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/createEvent`).set('Authorization', 'admin token').send({ eventName: 'Valid name', description: 'Valid description', date: "2023-08-01T16:44:38.149Z" });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid price' });
  });
  it('Should return 400 if the price is less than 0', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/createEvent`).set('Authorization', 'admin token').send({ eventName: 'Valid name', description: 'Valid description', date: "2023-08-01T16:44:38.149Z", price: -1 });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid price' });
  });
  it('Should return 400 if isOpen is not a boolean', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/createEvent`).set('Authorization', 'admin token').send({ eventName: 'Valid name', description: 'Valid description', date: "2023-08-01T16:44:38.149Z", price: 1, isOpen: 'not a boolean' });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'isOpen must be a boolean' });
  });
  it('Should return 400 if placesRemaining is false and price is not 0', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/createEvent`).set('Authorization', 'admin token').send({ eventName: 'Valid name', description: 'Valid description', date: "2023-08-01T16:44:38.149Z", price: 1, isOpen: true, placesRemaining: null });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Ticketless events cannot be charged.' });
  });
  it('Should return 400 if placesRemaining is false and the event is open', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/createEvent`).set('Authorization', 'admin token').send({ eventName: 'Valid name', description: 'Valid description', date: "2023-08-01T16:44:38.149Z", price: 0, isOpen: false, placesRemaining: null });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Ticketless events must be open.' });
  });
  it('Should return 201 if the event is created', async function () {
    const builtEvent = SequelizeEvent.build(validEvents[0]);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeEvent, 'create').resolves(builtEvent);
    const res = await chai.request(app).post(`${route}/createEvent`).set('Authorization', 'admin token').send(validEvents[0]);
    expect(res.status).to.be.equal(201);
    expect(res.body).to.deep.eq(returnedEvents[0]);
  });
});

describe('Admin /eventTickets/:eventId', function () {
  beforeEach(function () { sinon.restore() });
  it('Should return 404 if the event is not found', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeTicket, 'findAll').resolves([]);
    const res = await chai.request(app).get(`${route}/eventTickets/999`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(404);
    expect(res.body).to.deep.eq({ message: 'Event not found' });
  });
  it('Should return 200 if the event is found', async function () {
    const builtTickets = SequelizeTicket.bulkBuild(sameEventTickets);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeTicket, 'findAll').resolves(builtTickets);
    const res = await chai.request(app).get(`${route}/eventTickets/1`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.deep.eq(sameEventTickets);
  });
});

describe('Admin /updateEvent/:eventId', function () {
  beforeEach(function () { sinon.restore() });
  it('Should return 400 if eventId is not a number', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).put(`${route}/updateEvent/abc`).set('Authorization', 'admin token').send(validEvents[0]);
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid eventId' });
  });
  it('Should return 404 if the event is not found', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeEvent, 'findByPk').resolves(null);
    const res = await chai.request(app).put(`${route}/updateEvent/171`).set('Authorization', 'admin token').send(validEvents[0]);
    expect(res.status).to.be.equal(404);
    expect(res.body).to.deep.eq({ message: 'Event not found' });
  });
  it('Should return 200 if the event is updated', async function () {
    const builtEvent = SequelizeEvent.build(validEvents[0]);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(emailQueue, 'add').resolves();
    sinon.stub(SequelizeEvent, 'findByPk').resolves(builtEvent);
    const res = await chai.request(app).put(`${route}/updateEvent/1`).set('Authorization', 'admin token').send(validEvents[0]);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.deep.eq(returnedEvents[0]);
  });
});

describe('Admin /deleteEvent/:eventId', function () {
  beforeEach(function () { sinon.restore() });
  it('Should return 400 if eventId is not a number', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).delete(`${route}/deleteEvent/abc`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid event id' });
  });
  it('Should return 404 if the event is not found', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeEvent, 'destroy').resolves(undefined);
    const res = await chai.request(app).delete(`${route}/deleteEvent/171`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(404);
    expect(res.body).to.deep.eq({ message: 'Event not found' });
  });
  it('Should return 200 if the event has been deleted', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeEvent, 'destroy').resolves(1);
    const res = await chai.request(app).delete(`${route}/deleteEvent/1`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.deep.eq({ message: `Event id(1) has been deleted` });
  });
});

describe('Admin /deleteUser/:userId', function () {
  beforeEach(function () { sinon.restore() });
  it('Should return 400 if userId is not a number', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).delete(`${route}/deleteUser/abc`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid user id' });
  });
  it('Should return 404 if the user is not found', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeUser, 'findByPk').resolves(null);
    const res = await chai.request(app).delete(`${route}/deleteUser/171`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(404);
    expect(res.body).to.deep.eq({ message: 'User not found' });
  });
  it('Should return 200 if the user has been deleted', async function () {
    const builtUser = SequelizeUser.build(validNewUser);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeUser, 'findByPk').resolves(builtUser);
    const res = await chai.request(app).delete(`${route}/deleteUser/1`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.deep.eq({ message: `User id(1) has been deleted` });
  });
});