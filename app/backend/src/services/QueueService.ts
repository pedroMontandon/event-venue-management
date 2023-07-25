import * as Queue from 'bull';
import { sendBoughtTicketEmail, sendCodeEmail } from '../utils/sendEmail';

export const emailQueue = new Queue('emailAuthentication', {
  redis: {
    port: 6379,
    host: 'redis',
  },
});

emailQueue.process(async (job) => {
  try {
    if (job.data.method === 'sendCodeEmail') {
      const { data: { email, username, code } } = job;
      await sendCodeEmail(email, username, code);
    }
    if (job.data.method === 'sendBoughtTicketEmail') {
      const { data: { email, eventName, visitor, date } } = job;
      await sendBoughtTicketEmail(email, eventName, visitor, date);
    }
  } catch (error) {
    console.log(error);
  }
});

export default {
  emailQueue,
};