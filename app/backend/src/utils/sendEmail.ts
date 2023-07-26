import * as nodemailer from 'nodemailer';
import 'dotenv/config';

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

export async function sendBoughtTicketEmail(email: string, eventName: string, visitor: string, date: string): Promise<void> {
  await transport.sendMail({
    from: 'event-venue@example.com',
    to: email,
    subject: 'Bought Ticket',
    html: `<h1>Ticket bought by you</h1><p>The ${eventName} event ticket was purchased for ${visitor}</p>. 
    <p>Please, present this ticket on the day of the event (${date})</p>`,
  });
}

export async function sendInviteEmail(email: string, visitor: string, eventName: string, code: string): Promise<void> {
  await transport.sendMail({
    from: 'event-venue@example.com',
    to: email,
    subject: 'You Have Been Invited',
    html: `<h1> You have been invited to ${eventName}</h1> 
    <p>A invite has been made in the name of ${visitor}. Access your account and get your ticket</p>
    <p>Here is your access code: ${code}</p>`,
  });
}

export async function sendCodeEmail(email:string, username: string, code:string): Promise<void> {
  await transport.sendMail({
    from: 'event-venue@example.com',
    to: email,
    subject: 'Activation Code',
    html: `<h1>Welcome to Event Venue, 
    ${username}</h1><p>Please access this page to activate your account: ${code}</p>`,
  });
}

export default {
  sendCodeEmail,
};