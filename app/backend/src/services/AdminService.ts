import { ITicket } from "../interfaces/tickets/ITicket";
import { ServiceResponse } from "../interfaces/ServiceResponse";
import EventModel from "../models/EventModel";
import TicketModel from "../models/TicketModel";
import UserModel from "../models/UserModel";
import * as bcrypt from "bcryptjs";
import { emailQueue } from "./QueueService";
import { IEvent } from "../interfaces/events/IEvent";
import { NewEntity } from "../interfaces";
import { ITicketUsers } from "../interfaces/tickets/ITicketUsers";

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
  };

  async createEvent(data: NewEntity<IEvent>): Promise<ServiceResponse<IEvent>> {
    const event = await this.eventModel.create(data);
    return { status: 'CREATED', data: event };
  };

  async getEventTickets(eventId: number): Promise<ServiceResponse<ITicketUsers[]>> {
    const tickets = await this.ticketModel.findByEventId(eventId) as ITicketUsers[];
    return { status: 'SUCCESSFUL', data: tickets };
  }

  async updateEvent(id: number, data: Partial<IEvent>): Promise<ServiceResponse<IEvent>> {
    const event = await this.eventModel.update(id, data);
    if (!event) return { status: 'NOT_FOUND', data: { message: 'Event not found' } };
    const eventTickets = await this.ticketModel.findByEventId(id) as ITicketUsers[];
    if (Object.keys(data).includes('date')) {
      eventTickets.forEach((ticket) => {
        emailQueue.add({ method: 'sendUpdatedEventEmail', email: ticket.users[0].email, visitor: ticket.visitor, eventName: event.eventName });
      })
    }
    return { status: 'SUCCESSFUL', data: event };
  }

  async deleteEvent(eventId: number): Promise<ServiceResponse<{ message: string }>> {
    const event = await this.eventModel.delete(eventId);
    if (!event) return { status: 'NOT_FOUND', data: { message: 'Event not found' } };
    return { status: 'SUCCESSFUL', data: { message: `Event id(${eventId}) has been deleted` } };
  }

  async deleteUser(userId: number): Promise<ServiceResponse<{ message: string }>> {
    const user = await this.userModel.delete(userId);
    if (!user) return { status: 'NOT_FOUND', data: { message: 'User not found' } };
    return { status: 'SUCCESSFUL', data: { message: `User id(${userId}) has been deleted` } };
  }
}