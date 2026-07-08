import { z } from 'zod';

export const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be 6+ characters"),
    role: z.enum(['TENANT', 'LANDLORD', 'ADMIN']),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});