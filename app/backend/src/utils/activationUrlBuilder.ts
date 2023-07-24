import { ActivationUrlPayload } from '../types/ActivationUrlPayload';

const buildActivationUrl = (payload: ActivationUrlPayload): string => 
  `${process.env.HOST}:${process.env.APP_PORT}/user/activate/${payload.id}/${payload.activationCode}`;

export default buildActivationUrl;