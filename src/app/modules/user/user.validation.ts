import { z } from 'zod';
import { IsActive, Role } from './user.interface';

export const zCreateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'name must be at least 2 characters')
    .refine(val => val.trim() !== '', {
      message: 'name is required',
    }),
  email: z
    .string()
    .email('Invalid email format')
    .refine(val => val.trim() !== '', {
      message: 'email is required',
    }),
  phone: z
    .string()
    .min(10, 'phone must be at least 10 digits')
    .refine(val => val.trim() !== '', {
      message: 'phone is required',
    }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          'password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      }
    ),

  role: z
    .enum([Role.USER, Role.AGENT])
    .refine(val => !Object.values(val).includes(val), {
      message: `Provided role must in ${Object.values(Role).join(', ')}`,
    }),
});

export const zUpdateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'name must be at least 2 characters')
    .refine(val => val.trim() !== '', {
      message: 'name is required',
    })
    .optional(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          'password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      }
    )
    .optional(),
  isDeleted: z
    .boolean()
    .refine(val => val === void 0, {
      message: 'isDeleted is must be boolean',
    })
    .optional(),
  isActive: z
    .enum(Object.values(IsActive))
    .refine(val => !Object.values(val).includes(val), {
      message: `Provided role must in ${Object.values(IsActive).join(', ')}`,
    })
    .optional(),
  isVerified: z
    .boolean()
    .refine(val => val === void 0, {
      message: 'isVerified is must be boolean',
    })
    .optional(),

  role: z
    .enum(Object.values(Role))
    .refine(val => !Object.values(val).includes(val), {
      message: `Provided role must in ${Object.values(Role).join(', ')}`,
    })
    .optional(),
});
