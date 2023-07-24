import { Request, Response } from 'express';
import EventService from '../services/EventService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class EventController {
  constructor(private eventService = new EventService()) {}

  async findAll(req: Request, res: Response): Promise<Response> {
    const token = req.headers.authorization;
    const events = await this.eventService.findAll(token);
    return res.status(mapStatusHTTP(events.status)).json(events.data);
  }    
}