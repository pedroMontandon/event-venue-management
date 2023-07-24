import { NextFunction, Request, Response } from 'express';
import JwtUtils from '../utils/JwtUtils';

export default class Validations {
  private static passwordLength = 6;
  private static emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  static validateLogin(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!Validations.emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (password.length < Validations.passwordLength) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    return next();
  }

  static validateSignUp(req: Request, res: Response, next: NextFunction): Response | void {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    return next();
  }
}