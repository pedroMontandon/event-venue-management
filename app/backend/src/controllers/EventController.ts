import { Request, Response } from 'express';
import EventService from '../services/EventService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class EventController {
  constructor(private eventService = new EventService()) {}
  async findAllOpened(req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.eventService.findAllOpened();
    return res.status(mapStatusHTTP(status)).json(data);
  }    
}