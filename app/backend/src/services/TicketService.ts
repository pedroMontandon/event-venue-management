import TicketModel from "../models/TicketModel";
import { ITicket } from "../interfaces/tickets/ITicket";
import { ServiceResponse, ServiceResponseError } from "../interfaces/ServiceResponse";
import JwtUtils from "../utils/JwtUtils";
import EventModel from "../models/EventModel";
import * as bcrypt from "bcryptjs";

export default class TicketService {
  constructor (private ticketModel = new TicketModel(), private eventModel = new EventModel()) {}
  private jwtUtils = new JwtUtils();

  async findAll(): Promise<ServiceResponse<ITicket[]>> {
    const tickets = await this.ticketModel.findAll();
    return { status: "SUCCESSFUL", data: tickets };
  }

  async getMyTickets(token: string): Promise<ServiceResponse<ITicket[]>> {
    const userId = this.jwtUtils.decode(token).id;
    const tickets = await this.ticketModel.findMyTickets(userId);
    return { status: "SUCCESSFUL", data: tickets };
  }

  async eventAvailability(eventId: number): Promise<ServiceResponseError | null> {
    const event = await this.eventModel.findById(eventId);
    if (!event) return { status: 'NOT_FOUND', data: { message: 'Event not found' } };
    if (!event.isOpen) return { status : 'UNAUTHORIZED', data: { message: 'Event is closed. Contact your administrator for more information' } };
    if (event.placesRemaining === null) {
      return { status: 'INVALID_DATA', data: { message: 'This event does not require a ticket.' } };
    }
    if (Number(event.placesRemaining) < 1) {
      return { status: 'INVALID_DATA', data: { message: 'Event is full' } };
    }
    return null;
  }

  async buyTicket(eventId: number, visitor: string, token: string): Promise<ServiceResponse<ITicket>> {
    const notAvailableEvent = await this.eventAvailability(eventId);
    if (notAvailableEvent) return notAvailableEvent;
    const userId = this.jwtUtils.decode(token).id;
    const accessKey = bcrypt.hashSync(visitor, 10);
    const ticket = await this.ticketModel.create({ eventId, userId, visitor, reclaimed: false, accessKey });
    await this.eventModel.updatePlaces(eventId);
    return { status: "CREATED", data: ticket };
  }
}