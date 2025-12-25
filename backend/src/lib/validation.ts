import { z } from 'zod';

export const createTodoSchema = z.object({
  text: z.string().min(1, 'Text is required').max(500, 'Text is too long'),
});

export const updateTodoSchema = z.object({
  text: z.string().min(1, 'Text is required').max(500, 'Text is too long').optional(),
  completed: z.boolean().optional(),
}).refine((data) => data.text !== undefined || data.completed !== undefined, {
  message: 'At least one field (text or completed) must be provided',
});

export const uuidSchema = z.string().uuid('Invalid UUID format');

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
