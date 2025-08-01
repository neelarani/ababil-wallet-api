"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zWithdrawSchema = exports.zTopUpMoneySchema = void 0;
const zod_1 = __importDefault(require("zod"));
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
