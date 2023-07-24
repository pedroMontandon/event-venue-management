import * as jwt from 'jsonwebtoken';
import { Identifiable } from '../interfaces';

export default class JwtUtils {
  private jwtSecret = process.env.JWT_SECRET || 'secret';

  sign(payload: { id: Identifiable['id'], email: string, role: string }): string {
    return jwt.sign(payload, this.jwtSecret);
  }

  verify(token: string): { id: Identifiable['id'], email: string, role: string } {
    const bearerNToken = token.split(' ');
    return jwt.verify(bearerNToken[1], this.jwtSecret) as { id: Identifiable['id'], email: string, role: string };
  }

  decode(token: string): { id: Identifiable['id'], email: string, role: string } {
    const bearerNToken = token.split(' ');
    return jwt.decode(bearerNToken[1]) as { id: Identifiable['id'], email: string, role: string };
  }

  isAdmin(token: string): boolean {
    return this.decode(token).role === 'admin';
  }
}