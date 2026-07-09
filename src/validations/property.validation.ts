import { z } from 'zod';

export const createPropertyValidation = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string(),
    price: z.number().positive(),
    location: z.string(),
    categoryId: z.string().uuid(),
    amenities: z.array(z.string()),
  }),
});