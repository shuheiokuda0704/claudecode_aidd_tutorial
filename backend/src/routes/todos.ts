import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { todos } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { logger } from '../lib/logger.js';
import { AppError } from '../middleware/errorHandler.js';
import { createTodoSchema, updateTodoSchema, uuidSchema } from '../lib/validation.js';

const router = Router();

// GET /api/todos - 全TODOを取得
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    logger.debug('Fetching all todos');
    const allTodos = await db.select().from(todos);
    logger.info({ count: allTodos.length }, 'Todos fetched successfully');
    res.json(allTodos);
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch todos');
    next(error);
  }
});

// POST /api/todos - 新しいTODOを作成
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createTodoSchema.parse(req.body);

    logger.debug({ text: validatedData.text }, 'Creating new todo');
    const [newTodo] = await db
      .insert(todos)
      .values({ text: validatedData.text.trim(), completed: false })
      .returning();

    logger.info({ todoId: newTodo.id }, 'Todo created successfully');
    res.status(201).json(newTodo);
  } catch (error) {
    logger.error({ err: error }, 'Failed to create todo');
    next(error);
  }
});

// PUT /api/todos/:id - TODOを更新
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = uuidSchema.parse(req.params.id);
    const validatedData = updateTodoSchema.parse(req.body);

    const updateData: { text?: string; completed?: boolean; updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (validatedData.text !== undefined) {
      updateData.text = validatedData.text.trim();
    }
    if (validatedData.completed !== undefined) {
      updateData.completed = validatedData.completed;
    }

    logger.debug({ todoId: id, updates: updateData }, 'Updating todo');
    const [updatedTodo] = await db
      .update(todos)
      .set(updateData)
      .where(eq(todos.id, id))
      .returning();

    if (!updatedTodo) {
      throw new AppError(404, 'Todo not found');
    }

    logger.info({ todoId: id }, 'Todo updated successfully');
    res.json(updatedTodo);
  } catch (error) {
    logger.error({ err: error }, 'Failed to update todo');
    next(error);
  }
});

// DELETE /api/todos/:id - TODOを削除
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = uuidSchema.parse(req.params.id);

    logger.debug({ todoId: id }, 'Deleting todo');
    const [deletedTodo] = await db.delete(todos).where(eq(todos.id, id)).returning();

    if (!deletedTodo) {
      throw new AppError(404, 'Todo not found');
    }

    logger.info({ todoId: id }, 'Todo deleted successfully');
    res.json({ message: 'Todo deleted successfully', todo: deletedTodo });
  } catch (error) {
    logger.error({ err: error }, 'Failed to delete todo');
    next(error);
  }
});

export default router;
