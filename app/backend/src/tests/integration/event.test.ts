import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import JwtUtils from '../../utils/JwtUtils';
import { app } from '../../app';

import SequelizeEvent from '../../database/models/SequelizeEvent';
import { returnedEvents, validEvents } from '../mocks/eventMocks';
import EventModel from '../../models/EventModel';

chai.use(chaiHttp);
const { expect } = chai;

const route = '/events'

describe('Event / route', function () {
  beforeEach(function () { sinon.restore() });
  it('Should return only open events as it is not logged as an admin', async function () {
    const builtEvents = SequelizeEvent.bulkBuild(validEvents);
    sinon.stub(EventModel.prototype, 'findAllOpened').resolves([builtEvents[0]]);
    sinon.stub(SequelizeEvent, 'findAll').resolves(builtEvents);
    const res = await chai.request(app).get(`${route}/`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.deep.eq([returnedEvents[0]]);
  });
  it('Should return all events as it is logged as an admin', async function () {
    const builtEvents = SequelizeEvent.bulkBuild(validEvents);
    sinon.stub(EventModel.prototype, 'findAllOpened').resolves([builtEvents[0]]);
    sinon.stub(SequelizeEvent, 'findAll').resolves(builtEvents);
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).get(`${route}/`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.deep.eq(returnedEvents);
  });
  it('Should return 500 if the token is invalid', async function () {
    const res = await chai.request(app).get(`${route}/`).set('Authorization', 'invalid token');
    expect(res.status).to.be.equal(500);
    expect(res.body).to.deep.eq({ message: 'Internal server error' });
  });   
})