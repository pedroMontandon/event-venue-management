import { Request, Response } from 'express';
import TicketService from '../services/TicketService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class TicketController {
  constructor(private ticketService = new TicketService()) {}

  async getMyTickets(req: Request, res: Response): Promise<Response> {
    const token = req.headers.authorization;
    const tickets = await this.ticketService.getMyTickets(token as string);
    return res.status(mapStatusHTTP(tickets.status)).json(tickets.data);
  }
}