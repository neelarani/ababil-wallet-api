"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zChangePasswordSchema = exports.zResetPasswordSchema = exports.zForgotPasswordSchema = exports.zGetVerifyUserSecretSchema = exports.zCredentialLoginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.zCredentialLoginSchema = zod_1.default.object({
    email: zod_1.default
        .string()
        .email('Invalid email format')
        .refine(val => val.trim() !== '', {
        message: 'email is required',
    }),
    password: zod_1.default
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
        message: 'password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    }),
});
exports.zGetVerifyUserSecretSchema = zod_1.default.object({
    email: zod_1.default
        .string()
        .email('Invalid email format')
        .refine(val => val.trim() !== '', {
        message: 'email is required',
    }),
});
exports.zForgotPasswordSchema = zod_1.default.object({
    email: zod_1.default
        .string()
        .email('Invalid email format')
        .refine(val => val.trim() !== '', {
        message: 'email is required',
    }),
});
exports.zResetPasswordSchema = zod_1.default.object({
    password: zod_1.default
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
        message: 'password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    }),
});
exports.zChangePasswordSchema = zod_1.default.object({
    oldPassword: zod_1.default
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
        message: 'password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    }),
    newPassword: zod_1.default
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
        message: 'password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    }),
});
