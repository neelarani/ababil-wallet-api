import ejs from 'ejs';
import { join } from 'path';
import { ENV, mailTransporter } from '@/config';
import { TSendMail } from '@/interface';

export const sendMail: TSendMail = async options => {
  const { subject, to, template } = options;

  const html = await ejs.renderFile(
    join(process.cwd(), 'src', 'shared', 'templates', `${template?.name}.ejs`),
    template?.data
  );

  return mailTransporter.sendMail({
    from: ENV.EMAIL_SENDER_SMTP_USER,
    to,
    subject,
    html,
  });
};
