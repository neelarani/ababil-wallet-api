import z from 'zod';
import { ObjectId } from 'mongodb';

export const zTopUpMoneySchema = z.object({
  amount: z.number().refine(val => val !== 0, {
    message: 'Amount is positive integer',
  }),
});

export const zWithdrawSchema = z.object({
  amount: z.number().refine(val => val !== 0, {
    message: 'Amount is positive integer',
  }),
});

export const zSendMoneySchema = z.object({
  receiverId: z.string().refine(val => ObjectId.isValid(val), {
    message: 'Invalid MongoDB ObjectId',
  }),

  amount: z
    .number()
    .refine(val => val !== 0, {
      message: 'name is positive integer',
    })
    .min(1, 'Amount must be at least 1'),
});
