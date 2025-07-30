"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z
        .string({
        error: issue => issue.input === void 0 ? `PORT is required` : `PORT must be string`,
    })
        .transform((val, ctx) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
            ctx.addIssue({
                code: 'custom',
                message: 'PORT must be a number',
            });
            return zod_1.z.NEVER;
        }
        return parsed;
    }),
    DB_URI: zod_1.z.string({
        error: issue => issue.input === void 0 ? `DB_URI is required` : `DB_URI must be string`,
    }),
    DB_PASS: zod_1.z.string({
        error: issue => issue.input === void 0 ? `DB_PASS is required` : `DB_PASS must be string`,
    }),
    DB_USER: zod_1.z.string({
        error: issue => issue.input === void 0 ? `DB_USER is required` : `DB_USER must be string`,
    }),
    DB_NAME: zod_1.z.string({
        error: issue => issue.input === void 0 ? `DB_NAME is required` : `DB_NAME must be string`,
    }),
    NODE_ENV: zod_1.z.enum(['development', 'production'], {
        error: issue => issue.input === undefined
            ? 'NODE_ENV is missing in your ENV file'
            : "NODE_ENV must be 'development' or 'production'",
    }),
    BCRYPT_SALT_ROUND: zod_1.z
        .string({
        error: issue => issue.input === void 0
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
            return zod_1.z.NEVER;
        }
        return parsed;
    }),
    EXPRESS_SESSION_SECRET: zod_1.z.string({
        error: issue => issue.input === void 0
            ? `EXPRESS_SESSION_SECRET is required`
            : `EXPRESS_SESSION_SECRET must be string`,
    }),
    JWT_ACCESS_SECRET: zod_1.z.string({
        error: issue => issue.input === void 0
            ? `JWT_ACCESS_SECRET is required`
            : `JWT_ACCESS_SECRET must be string`,
    }),
    JWT_ACCESS_EXPIRES: zod_1.z.string({
        error: issue => issue.input === void 0
            ? `JWT_ACCESS_EXPIRES is required`
            : `JWT_ACCESS_EXPIRES must be string`,
    }),
    JWT_REFRESH_SECRET: zod_1.z.string({
        error: issue => issue.input === void 0
            ? `JWT_REFRESH_SECRET is required`
            : `JWT_REFRESH_SECRET must be string`,
    }),
    JWT_REFRESH_EXPIRES: zod_1.z.string({
        error: issue => issue.input === void 0
            ? `JWT_REFRESH_EXPIRES is required`
            : `JWT_REFRESH_EXPIRES must be string`,
    }),
    SUPER_ADMIN_EMAIL: zod_1.z.string({
        error: issue => issue.input === void 0
            ? `SUPER_ADMIN_EMAIL is required`
            : `SUPER_ADMIN_EMAIL must be string`,
    }),
    SUPER_ADMIN_PASSWORD: zod_1.z.string({
        error: issue => issue.input === void 0
            ? `SUPER_ADMIN_PASSWORDis required`
            : `SUPER_ADMIN_PASSWORD must be string`,
    }),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    parsed.error.issues.forEach(issue => {
        console.error(`ENV ERROR: ${issue.message}, Path: ${issue.path}`);
    });
    process.exit(1);
}
exports.ENV = parsed.data;
