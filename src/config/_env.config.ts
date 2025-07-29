import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
  PORT: z
    .string({
      error: (issue) =>
        issue.input === void 0 ? `PORT is required` : `PORT must be string`,
    })
    .transform((val, ctx) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: "custom",
          message: "PORT must be a number",
        });
        return z.NEVER;
      }
      return parsed;
    }),
  DB_URI: z.string({
    error: (issue) =>
      issue.input === void 0 ? `DB_URI is required` : `DB_URI must be string`,
  }),
  DB_PASS: z.string({
    error: (issue) =>
      issue.input === void 0 ? `DB_PASS is required` : `DB_PASS must be string`,
  }),
  DB_USER: z.string({
    error: (issue) =>
      issue.input === void 0 ? `DB_USER is required` : `DB_USER must be string`,
  }),
  DB_NAME: z.string({
    error: (issue) =>
      issue.input === void 0 ? `DB_NAME is required` : `DB_NAME must be string`,
  }),
  NODE_ENV: z.enum(["development", "production"], {
    error: (issue) =>
      issue.input === undefined
        ? "NODE_ENV is missing in your ENV file"
        : "NODE_ENV must be 'development' or 'production'",
  }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  parsed.error.issues.forEach((issue) => {
    console.error(`ENV ERROR: ${issue.message}, Path: ${issue.path}`);
  });
  process.exit(1);
}

export const ENV: z.infer<typeof envSchema> = parsed.data;
