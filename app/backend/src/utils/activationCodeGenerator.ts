import * as crypto from 'node:crypto';

const generateActivationCode = (): string => 
  crypto.randomBytes(16).toString('hex');  

export default {
  generateActivationCode,
};