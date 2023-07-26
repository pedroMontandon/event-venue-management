import { Request, Response } from 'express';
import AdminService from '../services/AdminService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class AdminController {
  constructor(private adminService = new AdminService()) {}
  
  async inviteUser(req: Request, res: Response): Promise<Response> {
    const { userId, eventId } = req.params;
    const { visitor } = req.body;

    const { data, status } = await this.adminService.inviteUser(+userId, +eventId, visitor);
    return res.status(mapStatusHTTP(status)).json(data);
  }
}