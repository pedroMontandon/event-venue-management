import * as Queue from 'bull';
import { sendCodeEmail } from '../utils/sendEmail';

export const emailQueue = new Queue('emailAuthentication', {
  redis: {
    port: 6379,
    host: 'redis',
  },
});

emailQueue.process(async (job) => {
  try {
    const { data: { email, username, code } } = job;
    await sendCodeEmail(email, username, code);
  } catch (error) {
    console.log(error);
  }
});

export default {
  emailQueue,
};