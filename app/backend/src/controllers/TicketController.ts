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

  async buyTicket(req: Request, res: Response): Promise<Response> {
    const { visitor } = req.body;
    const { eventId } = req.params;
    const token = req.headers.authorization;
    if(!Number(eventId)) {
      return res.status(400).json({ message: 'Invalid eventId' });
    };
    const ticket = await this.ticketService.buyTicket(+eventId, visitor, token as string);
    return res.status(mapStatusHTTP(ticket.status)).json(ticket.data);
  }

  async reclaimTicket(req: Request, res: Response): Promise<Response> {
    const { ticketId } = req.params;
    const { accessKey } = req.body;
    if(!Number(ticketId)) {
      return res.status(400).json({ message: 'Invalid ticketId' });
    };
    const { status, data } = await this.ticketService.reclaimTicket(+ticketId, accessKey);
    return res.status(mapStatusHTTP(status)).json(data);
  }
}