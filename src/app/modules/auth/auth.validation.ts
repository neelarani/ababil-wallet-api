import { isValidObjectId } from 'mongoose';
import z from 'zod';

export const zCredentialLoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .refine(val => val.trim() !== '', {
      message: 'email is required',
    }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      {
        message:
          'password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      }
    ),
});

export const zGetVerifyUserSecretSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .refine(val => val.trim() !== '', {
      message: 'email is required',
    }),
});

export const zForgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .refine(val => val.trim() !== '', {
      message: 'email is required',
    }),
});

export const zResetPasswordSchema = z.object({
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      {
        message:
          'password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      }
    ),
});

export const zChangePasswordSchema = z.object({
  oldPassword: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      {
        message:
          'password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      }
    ),
  newPassword: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      {
        message:
          'password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      }
    ),
});
