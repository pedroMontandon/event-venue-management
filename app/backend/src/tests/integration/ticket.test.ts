import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import JwtUtils from '../../utils/JwtUtils';
import { app } from '../../app';
import SequelizeTicket from '../../database/models/SequelizeTicket';
import { validTickets } from '../mocks/ticketsMocks';
import SequelizeEvent from '../../database/models/SequelizeEvent';
import { closedEvent, freeOpenEvent, fullEvent, validEvents } from '../mocks/eventMocks';
import { emailQueue } from '../../services/QueueService';

chai.use(chaiHttp);
const { expect } = chai;

const route = '/tickets';

describe('Ticket /mytickets route', function () {
  beforeEach(function () { sinon.restore() });
  it('Should 401 if there is no token', async function () {
    const res = await chai.request(app).get(`${route}/mytickets`);
    expect(res.status).to.be.equal(401);
    expect(res.body).to.deep.eq({ message: 'Insert a token' });
  });
  it('Should return "insert a valid token"(401)', async function () {
    const res = await chai.request(app).get(`${route}/mytickets`).set('Authorization', 'invalid token');
    expect(res.status).to.be.equal(401);
    expect(res.body).to.deep.eq({ message: 'Insert a valid token' });
  });
  it('Should return the user tickets (200)', async function () {
    const builtTickets = SequelizeTicket.bulkBuild(validTickets);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeTicket, 'findAll').resolves([builtTickets[0]]);
    const res = await chai.request(app).get(`${route}/mytickets`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.deep.eq([validTickets[0]]);
  });
})

describe('Ticket /buyticket/:eventId route', function () {
  beforeEach(function () { sinon.restore() });
  it('Should return 400 if there is no visitor', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/buyticket/1`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Missing required fields' });
  });
  it("Should return 400 if visitor's length is less than 4", async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/buyticket/1`).set('Authorization', 'admin token').send({ visitor: 'abc' });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Visitor must be at least 4 characters long' });
  });
  it("Should return 400 if eventId is not a number" , async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).post(`${route}/buyticket/abc`).set('Authorization', 'admin token').send({ visitor: 'Valid visitor' });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid eventId' });
  });
  it('Should return 404 if the eventId does not exist', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeEvent, 'findByPk').resolves(null);
    const res = await chai.request(app).post(`${route}/buyticket/999`).set('Authorization', 'admin token').send({ visitor: 'Valid visitor' });
    expect(res.status).to.be.equal(404);
    expect(res.body).to.deep.eq({ message: 'Event not found' });
  });
  it('Should return 401 if the event is not open', async function () {
    const builtEvent = SequelizeEvent.build(closedEvent);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeEvent, 'findByPk').resolves(builtEvent);
    const res = await chai.request(app).post(`${route}/buyticket/2`).set('Authorization', 'admin token').send({ visitor: 'Valid visitor' });
    expect(res.status).to.be.equal(401);
    expect(res.body).to.deep.eq({ message: 'Event is closed. Contact your administrator for more information.' });
  });
  it('Should return 400 if the event is open and free', async function () {
    const builtEvent = SequelizeEvent.build(freeOpenEvent);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeEvent, 'findByPk').resolves(builtEvent);
    const res = await chai.request(app).post(`${route}/buyticket/4`).set('Authorization', 'admin token').send({ visitor: 'Valid visitor' });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'This event does not require a ticket.' });
  })
  it('Should return 401 if the event is full', async function () {
    const builtEvent = SequelizeEvent.build(fullEvent);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeEvent, 'findByPk').resolves(builtEvent);
    const res = await chai.request(app).post(`${route}/buyticket/2`).set('Authorization', 'admin token').send({ visitor: 'Valid visitor' });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Event is full.' });
  });
  it('Should return 201 if the ticket is created', async function () {
    const builtTicket = SequelizeTicket.build(validTickets[0]);
    const builtEvent = SequelizeEvent.build(validEvents[0]);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeTicket, 'create').resolves(builtTicket);
    sinon.stub(SequelizeEvent, 'findByPk').resolves(builtEvent);
    sinon.stub(SequelizeEvent, 'update').resolves();
    sinon.stub(emailQueue, 'add').resolves();
    const res = await chai.request(app).post(`${route}/buyticket/1`).set('Authorization', 'admin token').send({ visitor: 'Valid visitor' });
    expect(res.status).to.be.equal(201);
    expect(res.body).to.deep.eq(builtTicket.dataValues);
  });
})

describe('Ticket /reclaimticket/:ticketId route', function () {
  beforeEach(function () { sinon.restore() });
  it('Should return 401 if the user is not employee or admin', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'user', email: 'user@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'user', email: 'user@email' });
    const res = await chai.request(app).patch(`${route}/reclaimticket/1`).set('Authorization', 'user token');
    expect(res.status).to.be.equal(401);
    expect(res.body).to.deep.eq({ message: 'Only employees and admins can access this endpoint' });
  });
  it('Should return 400 if ticketId is not a number', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).patch(`${route}/reclaimticket/abc`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid ticketId' });
  });
  it('Should return 404 if the ticket does not exist', async function () {
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeTicket, 'findByPk').resolves(null);
    const res = await chai.request(app).patch(`${route}/reclaimticket/999`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(404);
    expect(res.body).to.deep.eq({ message: 'Ticket not found' });
  });
  it('Should return 400 if the access key is invalid', async function () {
    const builtTicket = SequelizeTicket.build(validTickets[0]);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeTicket, 'findByPk').resolves(builtTicket);
    const res = await chai.request(app).patch(`${route}/reclaimticket/1`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Invalid access key' });
  });
  it('Should return 400 if the ticket is already reclaimed', async function () {
    const builtTicket = SequelizeTicket.build(validTickets[2]);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeTicket, 'findByPk').resolves(builtTicket);
    const res = await chai.request(app).patch(`${route}/reclaimticket/1`).set('Authorization', 'admin token').send({ accessKey: 'accessKey3' });
    expect(res.status).to.be.equal(400);
    expect(res.body).to.deep.eq({ message: 'Ticket already reclaimed' });
  });
  it('Should return 200 if you can reclaim the ticket', async function () {
    const builtTicket = SequelizeTicket.build(validTickets[0]);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    sinon.stub(SequelizeTicket, 'findByPk').resolves(builtTicket);
    sinon.stub(SequelizeTicket, 'update').resolves();
    const res = await chai.request(app).patch(`${route}/reclaimticket/1`).set('Authorization', 'admin token').send({ accessKey: 'accessKey1' });
    expect(res.status).to.be.equal(200);
    expect(res.body).to.deep.eq({ message: `visitor1's ticket (id: 1) has been reclaimed successfully.` });
  });
})