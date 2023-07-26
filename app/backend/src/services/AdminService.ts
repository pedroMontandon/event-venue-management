import { ITicket } from "../interfaces/tickets/ITicket";
import { ServiceResponse } from "../interfaces/ServiceResponse";
import EventModel from "../models/EventModel";
import TicketModel from "../models/TicketModel";
import UserModel from "../models/UserModel";
import * as bcrypt from "bcryptjs";
import { emailQueue } from "./QueueService";
import { IEvent } from "../interfaces/events/IEvent";
import { NewEntity } from "../interfaces";

export default class AdminService {
  constructor (private eventModel = new EventModel(), private userModel = new UserModel(), private ticketModel = new TicketModel()) {}

  async inviteUser(userId: number, eventId: number, visitor: string): Promise<ServiceResponse<ITicket>> {
    const user = await this.userModel.findById(userId);
    if (!user) return { status: 'NOT_FOUND', data: { message: 'User not found' } };
    const event = await this.eventModel.findById(eventId);
    if (!event) return { status: 'NOT_FOUND', data: { message: 'Event not found' } };
    if (event.isOpen) return { status: 'UNAUTHORIZED', data: { message: 'Event is not closed. Acquire it through /buytickets route' } };
    const ticket = await this.ticketModel.create({ eventId, userId, visitor, reclaimed: false, accessKey: bcrypt.hashSync(visitor, 10) });
    emailQueue.add({ method: 'sendInviteEmail', email: user.email, visitor, eventName: event.eventName, code: ticket.accessKey });
    return { status: 'CREATED', data: ticket };
  }

  async createEvent(data: NewEntity<IEvent>): Promise<ServiceResponse<IEvent>> {
    const event = await this.eventModel.create(data);
    return { status: 'CREATED', data: event };
  }
}