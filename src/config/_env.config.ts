import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const parseNumber = (name: string) =>
  z.string().transform((val, ctx) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: 'custom',
        message: `${name} must be a number`,
      });
      return z.NEVER;
    }
    return parsed;
  });

const envSchema = z.object({
  PORT: parseNumber('PORT'),
  BCRYPT_SALT_ROUND: parseNumber('BCRYPT_SALT_ROUND'),
  WALLET_INITIAL_BALANCE: parseNumber('WALLET_INITIAL_BALANCE'),
  EMAIL_SENDER_SMTP_PORT: parseNumber('EMAIL_SENDER_SMTP_PORT'),

  DB_URI: z.string().nonempty('DB_URI is required'),
  DB_USER: z.string().nonempty('DB_USER is required'),
  DB_PASS: z.string().nonempty('DB_PASS is required'),
  DB_NAME: z.string().nonempty('DB_NAME is required'),

  NODE_ENV: z.enum(['development', 'production']).or(
    z.string().refine(() => false, {
      message: "NODE_ENV must be 'development' or 'production'",
    })
  ),

  EXPRESS_SESSION_SECRET: z
    .string()
    .nonempty('EXPRESS_SESSION_SECRET is required'),
  JWT_ACCESS_SECRET: z.string().nonempty('JWT_ACCESS_SECRET is required'),
  JWT_ACCESS_EXPIRES: z.string().nonempty('JWT_ACCESS_EXPIRES is required'),
  JWT_REFRESH_SECRET: z.string().nonempty('JWT_REFRESH_SECRET is required'),
  JWT_REFRESH_EXPIRES: z.string().nonempty('JWT_REFRESH_EXPIRES is required'),

  SUPER_ADMIN_EMAIL: z.string().nonempty('SUPER_ADMIN_EMAIL is required'),
  SUPER_ADMIN_PASSWORD: z.string().nonempty('SUPER_ADMIN_PASSWORD is required'),

  EMAIL_SENDER_SMTP_USER: z
    .string()
    .nonempty('EMAIL_SENDER_SMTP_USER is required'),
  EMAIL_SENDER_SMTP_PASS: z
    .string()
    .nonempty('EMAIL_SENDER_SMTP_PASS is required'),
  EMAIL_SENDER_SMTP_HOST: z
    .string()
    .nonempty('EMAIL_SENDER_SMTP_HOST is required'),

  BACKEND_BASE_URL: z.string().nonempty('BACKEND_BASE_URL is required'),
  FRONTEND_BASE_URL: z.string().nonempty('FRONTEND_BASE_URL is required'),
  USER_VERIFY_SECRET: z.string().nonempty('USER_VERIFY_SECRET is required'),

  GOOGLE_CLIENT_SECRET: z.string().nonempty('GOOGLE_CLIENT_SECRET is required'),
  GOOGLE_CLIENT_ID: z.string().nonempty('GOOGLE_CLIENT_ID is required'),
  GOOGLE_CALLBACK_URL: z.string().nonempty('GOOGLE_CALLBACK_URL is required'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  parsed.error.issues.forEach(issue => {
    console.error(`ENV ERROR: ${issue.message} at ${issue.path.join('.')}`);
  });
  process.exit(1);
}

export const ENV: z.infer<typeof envSchema> = parsed.data;
