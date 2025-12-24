import { Router } from 'express';
import { db } from '../db/index.js';
import { todos } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// GET /api/todos - 全TODOを取得
router.get('/', async (_req, res) => {
  try {
    const allTodos = await db.select().from(todos);
    res.json(allTodos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /api/todos - 新しいTODOを作成
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const [newTodo] = await db
      .insert(todos)
      .values({ text: text.trim(), completed: false })
      .returning();

    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT /api/todos/:id - TODOを更新
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    const updateData: any = { updatedAt: new Date() };
    if (text !== undefined) updateData.text = text;
    if (completed !== undefined) updateData.completed = completed;

    const [updatedTodo] = await db
      .update(todos)
      .set(updateData)
      .where(eq(todos.id, id))
      .returning();

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id - TODOを削除
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [deletedTodo] = await db
      .delete(todos)
      .where(eq(todos.id, id))
      .returning();

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully', todo: deletedTodo });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router;
