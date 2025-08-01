import z from 'zod';

export const zTopUpMoneySchema = z.object({
  amount: z.number().refine(val => val !== 0, {
    message: 'name is positive integer',
  }),
});

export const zWithdrawSchema = z.object({
  amount: z.number().refine(val => val !== 0, {
    message: 'name is positive integer',
  }),
});
