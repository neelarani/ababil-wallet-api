"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zSendMoneySchema = exports.zWithdrawSchema = exports.zTopUpMoneySchema = void 0;
const zod_1 = __importDefault(require("zod"));
const mongodb_1 = require("mongodb");
exports.zTopUpMoneySchema = zod_1.default.object({
    amount: zod_1.default.number().refine(val => val !== 0, {
        message: 'name is positive integer',
    }),
});
exports.zWithdrawSchema = zod_1.default.object({
    amount: zod_1.default.number().refine(val => val !== 0, {
        message: 'name is positive integer',
    }),
});
exports.zSendMoneySchema = zod_1.default.object({
    receiverId: zod_1.default.string().refine(val => mongodb_1.ObjectId.isValid(val), {
        message: 'Invalid MongoDB ObjectId',
    }),
    amount: zod_1.default
        .number()
        .refine(val => val !== 0, {
        message: 'name is positive integer',
    })
        .min(1, 'Amount must be at least 1'),
});
