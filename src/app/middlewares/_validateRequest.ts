import { catchAsync } from '@/shared/utils';
import { ZodObject, ZodRawShape } from 'zod';
export const validateRequest = (zs: ZodObject<ZodRawShape>) =>
  catchAsync(async (req, _, next) => {
    req.body = await zs.parseAsync(req.body);
    next();
  });
