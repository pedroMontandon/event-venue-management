import { Request, Response } from 'express';
import EventService from '../services/EventService';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import JwtUtils from '../utils/JwtUtils';

export default class EventController {
  constructor(private eventService = new EventService()) {}
  private jwtUtils = new JwtUtils();

  async findAllOpened(req: Request, res: Response): Promise<Response> {
    const token = req.headers.authorization;
    try {
      if (!token|| !this.jwtUtils.isAdmin(token)) {
        const { status, data } = await this.eventService.findAllOpened();
        return res.status(mapStatusHTTP(status)).json(data);
      }
      const { status, data } = await this.eventService.findAll();
      return res.status(mapStatusHTTP(status)).json(data);
    } catch(e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }    
}