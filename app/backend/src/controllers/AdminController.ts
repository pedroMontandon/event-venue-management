import { Request, Response } from 'express';
import AdminService from '../services/AdminService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class AdminController {
  constructor(private adminService = new AdminService()) {}
  
  async inviteUser(req: Request, res: Response): Promise<Response> {
    const { userId, eventId } = req.params;
    const { visitor } = req.body;
    if (!Number(userId) || !Number(eventId)) return res.status(400).json({ message: 'Invalid params' });
    const { data, status } = await this.adminService.inviteUser(+userId, +eventId, visitor);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async createEvent(req: Request, res: Response): Promise<Response> {
    const { data, status } = await this.adminService.createEvent(req.body);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async getEventTickets(req: Request, res: Response): Promise<Response> {
    const { eventId } = req.params;
    if(!Number(eventId)) return res.status(400).json({ message: 'Invalid event id' });
    const { data, status } = await this.adminService.getEventTickets(+eventId);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async updateEvent(req: Request, res: Response): Promise<Response> {
    const { eventId } = req.params;
    const { data, status } = await this.adminService.updateEvent(+eventId, req.body);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async deleteEvent(req: Request, res: Response): Promise<Response> {
    const { eventId } = req.params;
    if (!Number(eventId)) return res.status(400).json({ message: 'Invalid event id' });
    const { data, status } = await this.adminService.deleteEvent(+eventId);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    if (!Number(userId)) return res.status(400).json({ message: 'Invalid user id' });
    const { data, status } = await this.adminService.deleteUser(+userId);
    return res.status(mapStatusHTTP(status)).json(data);
  }
}