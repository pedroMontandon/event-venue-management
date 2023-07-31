import { Request, Response } from 'express';
import UserService from '../services/UserService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class UserController {
  constructor(private userService = new UserService()) {}
  
  async login(req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.userService.login(req.body);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async signUp(req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.userService.signUp(req.body);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  async activateAccount(req: Request, res: Response): Promise<Response> {
    const { userId, activationCode } = req.params;
    if (!Number(req.params.userId)) return res.status(400).json({ message: 'Invalid userId' });
    const { status, data } = await this.userService.activateAccount(Number(userId), activationCode);
    return res.status(mapStatusHTTP(status)).json(data);
  }
}

