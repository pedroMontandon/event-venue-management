import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import JwtUtils from '../../utils/JwtUtils';
import { app } from '../../app';
import SequelizeTicket from '../../database/models/SequelizeTicket';
import { validTickets } from '../mocks/ticketsMocks';

chai.use(chaiHttp);
const { expect } = chai;

const route = '/tickets'

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