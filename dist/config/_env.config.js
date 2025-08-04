"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const parseNumber = (name) => zod_1.z.string().transform((val, ctx) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
        ctx.addIssue({
            code: 'custom',
            message: `${name} must be a number`,
        });
        return zod_1.z.NEVER;
    }
    return parsed;
});
const envSchema = zod_1.z.object({
    PORT: parseNumber('PORT'),
    BCRYPT_SALT_ROUND: parseNumber('BCRYPT_SALT_ROUND'),
    WALLET_INITIAL_BALANCE: parseNumber('WALLET_INITIAL_BALANCE'),
    EMAIL_SENDER_SMTP_PORT: parseNumber('EMAIL_SENDER_SMTP_PORT'),
    DB_URI: zod_1.z.string().nonempty('DB_URI is required'),
    DB_USER: zod_1.z.string().nonempty('DB_USER is required'),
    DB_PASS: zod_1.z.string().nonempty('DB_PASS is required'),
    DB_NAME: zod_1.z.string().nonempty('DB_NAME is required'),
    NODE_ENV: zod_1.z.enum(['development', 'production']).or(zod_1.z.string().refine(() => false, {
        message: "NODE_ENV must be 'development' or 'production'",
    })),
    EXPRESS_SESSION_SECRET: zod_1.z
        .string()
        .nonempty('EXPRESS_SESSION_SECRET is required'),
    JWT_ACCESS_SECRET: zod_1.z.string().nonempty('JWT_ACCESS_SECRET is required'),
    JWT_ACCESS_EXPIRES: zod_1.z.string().nonempty('JWT_ACCESS_EXPIRES is required'),
    JWT_REFRESH_SECRET: zod_1.z.string().nonempty('JWT_REFRESH_SECRET is required'),
    JWT_REFRESH_EXPIRES: zod_1.z.string().nonempty('JWT_REFRESH_EXPIRES is required'),
    SUPER_ADMIN_EMAIL: zod_1.z.string().nonempty('SUPER_ADMIN_EMAIL is required'),
    SUPER_ADMIN_PASSWORD: zod_1.z.string().nonempty('SUPER_ADMIN_PASSWORD is required'),
    EMAIL_SENDER_SMTP_USER: zod_1.z
        .string()
        .nonempty('EMAIL_SENDER_SMTP_USER is required'),
    EMAIL_SENDER_SMTP_PASS: zod_1.z
        .string()
        .nonempty('EMAIL_SENDER_SMTP_PASS is required'),
    EMAIL_SENDER_SMTP_HOST: zod_1.z
        .string()
        .nonempty('EMAIL_SENDER_SMTP_HOST is required'),
    BACKEND_BASE_URL: zod_1.z.string().nonempty('BACKEND_BASE_URL is required'),
    FRONTEND_BASE_URL: zod_1.z.string().nonempty('FRONTEND_BASE_URL is required'),
    USER_VERIFY_SECRET: zod_1.z.string().nonempty('USER_VERIFY_SECRET is required'),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().nonempty('GOOGLE_CLIENT_SECRET is required'),
    GOOGLE_CLIENT_ID: zod_1.z.string().nonempty('GOOGLE_CLIENT_ID is required'),
    GOOGLE_CALLBACK_URL: zod_1.z.string().nonempty('GOOGLE_CALLBACK_URL is required'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    parsed.error.issues.forEach(issue => {
        console.error(`ENV ERROR: ${issue.message} at ${issue.path.join('.')}`);
    });
    process.exit(1);
}
exports.ENV = parsed.data;
