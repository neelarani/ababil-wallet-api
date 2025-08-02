import nodemailer from 'nodemailer';
import { ENV } from '@/config';

export const mailTransporter = nodemailer.createTransport({
  host: ENV.EMAIL_SENDER_SMTP_HOST,
  service: 'Gmail',
  secure: true,
  port: 465,
  auth: {
    user: ENV.EMAIL_SENDER_SMTP_USER,
    pass: ENV.EMAIL_SENDER_SMTP_PASS,
  },
});
