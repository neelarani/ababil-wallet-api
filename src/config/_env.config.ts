import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

const envSchema = z.object({
  PORT: z
    .string({
      error: issue =>
        issue.input === void 0 ? `PORT is required` : `PORT must be string`,
    })
    .transform((val, ctx) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: 'custom',
          message: 'PORT must be a number',
        });
        return z.NEVER;
      }
      return parsed;
    }),
  DB_URI: z.string({
    error: issue =>
      issue.input === void 0 ? `DB_URI is required` : `DB_URI must be string`,
  }),
  DB_PASS: z.string({
    error: issue =>
      issue.input === void 0 ? `DB_PASS is required` : `DB_PASS must be string`,
  }),
  DB_USER: z.string({
    error: issue =>
      issue.input === void 0 ? `DB_USER is required` : `DB_USER must be string`,
  }),
  DB_NAME: z.string({
    error: issue =>
      issue.input === void 0 ? `DB_NAME is required` : `DB_NAME must be string`,
  }),
  NODE_ENV: z.enum(['development', 'production'], {
    error: issue =>
      issue.input === undefined
        ? 'NODE_ENV is missing in your ENV file'
        : "NODE_ENV must be 'development' or 'production'",
  }),
  BCRYPT_SALT_ROUND: z
    .string({
      error: issue =>
        issue.input === void 0
          ? `DB_NAME is required`
          : `DB_NAME must be number`,
    })
    .transform((val, ctx) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: 'custom',
          message: 'PORT must be a number',
        });
        return z.NEVER;
      }
      return parsed;
    }),

  EXPRESS_SESSION_SECRET: z.string({
    error: issue =>
      issue.input === void 0
        ? `EXPRESS_SESSION_SECRET is required`
        : `EXPRESS_SESSION_SECRET must be string`,
  }),

  JWT_ACCESS_SECRET: z.string({
    error: issue =>
      issue.input === void 0
        ? `JWT_ACCESS_SECRET is required`
        : `JWT_ACCESS_SECRET must be string`,
  }),

  JWT_ACCESS_EXPIRES: z.string({
    error: issue =>
      issue.input === void 0
        ? `JWT_ACCESS_EXPIRES is required`
        : `JWT_ACCESS_EXPIRES must be string`,
  }),

  JWT_REFRESH_SECRET: z.string({
    error: issue =>
      issue.input === void 0
        ? `JWT_REFRESH_SECRET is required`
        : `JWT_REFRESH_SECRET must be string`,
  }),

  JWT_REFRESH_EXPIRES: z.string({
    error: issue =>
      issue.input === void 0
        ? `JWT_REFRESH_EXPIRES is required`
        : `JWT_REFRESH_EXPIRES must be string`,
  }),
  SUPER_ADMIN_EMAIL: z.string({
    error: issue =>
      issue.input === void 0
        ? `SUPER_ADMIN_EMAIL is required`
        : `SUPER_ADMIN_EMAIL must be string`,
  }),
  SUPER_ADMIN_PASSWORD: z.string({
    error: issue =>
      issue.input === void 0
        ? `SUPER_ADMIN_PASSWORDis required`
        : `SUPER_ADMIN_PASSWORD must be string`,
  }),
  WALLET_INITIAL_BALANCE: z
    .string({
      error: issue =>
        issue.input === void 0
          ? `WALLET_INITIAL_BALANCE is required`
          : `WALLET_INITIAL_BALANCE must be number`,
    })
    .transform((val, ctx) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: 'custom',
          message: 'WALLET_INITIAL_BALANCE must be number',
        });
        return z.NEVER;
      }
      return parsed;
    }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  parsed.error.issues.forEach(issue => {
    console.error(`ENV ERROR: ${issue.message}, Path: ${issue.path}`);
  });
  process.exit(1);
}

export const ENV: z.infer<typeof envSchema> = parsed.data;
