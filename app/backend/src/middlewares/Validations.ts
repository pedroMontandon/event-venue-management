import { NextFunction, Request, Response } from 'express';
import JwtUtils from '../utils/JwtUtils';

export default class Validations {
  private static passwordLength = 6;
  private static emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private static jwtUtils = new JwtUtils();

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

  static validateToken(req: Request, res: Response, next: NextFunction): Response | void {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return next();
  }

  static validateVisitor(req: Request, res: Response, next: NextFunction): Response | void {
    const { visitor } = req.body;
    if (!visitor) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (visitor.length < 4) {
      return res.status(400).json({ message: 'Visitor must be at least 4 characters long' });
    }
    return next();
  }

  static validateAdmin(req: Request, res: Response, next: NextFunction): Response | void {
    const token = req.headers.authorization;
    const { role } = Validations.jwtUtils.decode(token as string);
    if (role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return next();
  }

  static validateEmployee(req: Request, res: Response, next: NextFunction): Response | void {
    const token = req.headers.authorization;
    const { role } = Validations.jwtUtils.decode(token as string);
    if (role === 'user') {
      return res.status(401).json({ message: 'Only employees and admins can access this endpoint' });
    }
    return next();
  }
}