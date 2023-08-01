import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import { Response } from 'superagent';
// @ts-ignore
import chaiHttp = require('chai-http');

import JwtUtils from '../../utils/JwtUtils';
import { app } from '../../app';

import SequelizeEvent from '../../database/models/SequelizeEvent';
import { validEvents } from '../mocks/eventMocks';
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
    sinon.useFakeTimers(new Date("2023-08-01T16:44:38.149Z").getTime());
    const res = await chai.request(app).get(`${route}/`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.deep.eq([builtEvents[0].dataValues]);
  });
  it('Should return all events as it is logged as an admin', async function () {
    const builtEvents = SequelizeEvent.bulkBuild(validEvents);
    sinon.stub(EventModel.prototype, 'findAllOpened').resolves([builtEvents[0]]);
    sinon.stub(SequelizeEvent, 'findAll').resolves(builtEvents);
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 1, role: 'admin', email: 'admin@email' });
    const res = await chai.request(app).get(`${route}/`).set('Authorization', 'admin token');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.deep.eq(validEvents);
  });   
})