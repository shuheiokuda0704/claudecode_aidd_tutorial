import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('TODO API', () => {
  let createdTodoId: string;

  describe('GET /api/todos', () => {
    it('should return an array of todos', async () => {
      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const newTodo = {
        text: 'Test todo item',
      };

      const response = await request(app).post('/api/todos').send(newTodo);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.text).toBe(newTodo.text);
      expect(response.body.completed).toBe(false);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      createdTodoId = response.body.id;
    });

    it('should fail to create a todo without text', async () => {
      const response = await request(app).post('/api/todos').send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should fail to create a todo with empty text', async () => {
      const response = await request(app).post('/api/todos').send({
        text: '',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should fail to create a todo with text too long', async () => {
      const longText = 'a'.repeat(501);
      const response = await request(app).post('/api/todos').send({
        text: longText,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo text', async () => {
      const updatedText = {
        text: 'Updated todo text',
      };

      const response = await request(app).put(`/api/todos/${createdTodoId}`).send(updatedText);

      expect(response.status).toBe(200);
      expect(response.body.text).toBe(updatedText.text);
      expect(response.body.id).toBe(createdTodoId);
    });

    it('should update a todo completed status', async () => {
      const response = await request(app)
        .put(`/api/todos/${createdTodoId}`)
        .send({ completed: true });

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
      expect(response.body.id).toBe(createdTodoId);
    });

    it('should fail with invalid UUID', async () => {
      const response = await request(app).put('/api/todos/invalid-uuid').send({ text: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should fail when todo not found', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).put(`/api/todos/${nonExistentId}`).send({ text: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Todo not found');
    });

    it('should fail with no fields provided', async () => {
      const response = await request(app).put(`/api/todos/${createdTodoId}`).send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      const response = await request(app).delete(`/api/todos/${createdTodoId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Todo deleted successfully');
      expect(response.body.todo.id).toBe(createdTodoId);
    });

    it('should fail with invalid UUID', async () => {
      const response = await request(app).delete('/api/todos/invalid-uuid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should fail when todo not found', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).delete(`/api/todos/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Todo not found');
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Route not found');
    });
  });
});
