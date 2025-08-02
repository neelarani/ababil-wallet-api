"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zUpdateUserSchema = exports.zCreateUserSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.zCreateUserSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'name must be at least 2 characters')
        .refine(val => val.trim() !== '', {
        message: 'name is required',
    }),
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .refine(val => val.trim() !== '', {
        message: 'email is required',
    }),
    phone: zod_1.z
        .string()
        .min(10, 'phone must be at least 10 digits')
        .refine(val => val.trim() !== '', {
        message: 'phone is required',
    }),
    password: zod_1.z
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    }),
    role: zod_1.z
        .enum([user_interface_1.Role.USER, user_interface_1.Role.AGENT])
        .refine(val => !Object.values(val).includes(val), {
        message: `Provided role must in ${Object.values(user_interface_1.Role).join(', ')}`,
    }),
});
exports.zUpdateUserSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'name must be at least 2 characters')
        .refine(val => val.trim() !== '', {
        message: 'name is required',
    })
        .optional(),
    password: zod_1.z
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    })
        .optional(),
    isDeleted: zod_1.z
        .boolean()
        .refine(val => val === void 0, {
        message: 'isDeleted is must be boolean',
    })
        .optional(),
    isActive: zod_1.z
        .enum(Object.values(user_interface_1.IsActive))
        .refine(val => !Object.values(val).includes(val), {
        message: `Provided role must in ${Object.values(user_interface_1.IsActive).join(', ')}`,
    })
        .optional(),
    isVerified: zod_1.z
        .boolean()
        .refine(val => val === void 0, {
        message: 'isVerified is must be boolean',
    })
        .optional(),
    role: zod_1.z
        .enum(Object.values(user_interface_1.Role))
        .refine(val => !Object.values(val).includes(val), {
        message: `Provided role must in ${Object.values(user_interface_1.Role).join(', ')}`,
    })
        .optional(),
});
