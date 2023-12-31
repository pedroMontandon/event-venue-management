import TicketModel from "../models/TicketModel";
import { ITicket } from "../interfaces/tickets/ITicket";
import { ServiceResponse, ServiceResponseError } from "../interfaces/ServiceResponse";
import JwtUtils from "../utils/JwtUtils";
import EventModel from "../models/EventModel";
import * as bcrypt from "bcryptjs";
import { IEvent } from "../interfaces/events/IEvent";
import { emailQueue } from "./QueueService";

export default class TicketService {
  constructor (private ticketModel = new TicketModel(), private eventModel = new EventModel()) {}
  private jwtUtils = new JwtUtils();

  async getMyTickets(token: string): Promise<ServiceResponse<ITicket[]>> {
    const userId = this.jwtUtils.decode(token).id;
    const tickets = await this.ticketModel.findMyTickets(userId);
    return { status: "SUCCESSFUL", data: tickets };
  };

  async eventAvailability(eventId: number): Promise<ServiceResponse<IEvent>> {
    const event = await this.eventModel.findById(eventId);
    if (!event) return { status: 'NOT_FOUND', data: { message: 'Event not found' } };
    if (!event.isOpen) return { status : 'UNAUTHORIZED', data: { message: 'Event is closed. Contact your administrator for more information.' } };
    if (!event.placesRemaining && event.placesRemaining !== 0) {
      return { status: 'INVALID_DATA', data: { message: 'This event does not require a ticket.' } };
    }
    if (Number(event.placesRemaining) < 1) {
      return { status: 'INVALID_DATA', data: { message: 'Event is full.' } };
    }
    return { status: 'SUCCESSFUL', data: event };
  };

  async buyTicket(eventId: number, visitor: string, token: string): Promise<ServiceResponse<ITicket>> {
    const event = await this.eventAvailability(eventId);
    if (event.status !== 'SUCCESSFUL') return event as ServiceResponseError;
    const { id, email } = this.jwtUtils.decode(token);
    const accessKey = bcrypt.hashSync(visitor, 10);
    const ticket = await this.ticketModel.create({ eventId, userId: id, visitor, reclaimed: false, accessKey });
    await this.eventModel.updatePlaces(eventId);
    await emailQueue.add({ method: 'sendBoughtTicketEmail', email, eventName: event.data.eventName, visitor, date: event.data.date });
    return { status: 'CREATED', data: ticket };
  };

  async reclaimTicket(ticketId: number, accessKey: string): Promise<ServiceResponse<{message: string}>> {
    const ticket = await this.ticketModel.findById(ticketId);
    if (!ticket) return { status: 'NOT_FOUND', data: { message: 'Ticket not found' } };
    if (ticket.accessKey !== accessKey) return { status: 'INVALID_DATA', data: { message: 'Invalid access key' } };
    if (ticket.reclaimed) return { status: 'INVALID_DATA', data: { message: 'Ticket already reclaimed' } };
    await this.ticketModel.update(ticketId, { reclaimed: true });
    return { status: 'SUCCESSFUL', data: { message: `${ticket.visitor}'s ticket (id: ${ticketId}) has been reclaimed successfully.` } };
  };
};