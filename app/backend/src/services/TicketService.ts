import TicketModel from "../models/TicketModel";
import { ITicket } from "../interfaces/tickets/ITicket";
import { ServiceResponse } from "../interfaces/ServiceResponse";
import JwtUtils from "../utils/JwtUtils";

export default class TicketService {
  constructor (private ticketModel = new TicketModel()) {}
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
}