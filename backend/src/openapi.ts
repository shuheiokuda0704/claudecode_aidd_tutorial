export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'TODO API',
    version: '1.0.0',
    description: 'A RESTful API for managing TODO items with PostgreSQL backend',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Todos',
      description: 'TODO management endpoints',
    },
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Check if the server and database are operational',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                    },
                    uptime: {
                      type: 'number',
                      description: 'Server uptime in seconds',
                    },
                    environment: {
                      type: 'string',
                      enum: ['development', 'production', 'test'],
                    },
                  },
                },
              },
            },
          },
          '503': {
            description: 'Service unavailable',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/todos': {
      get: {
        tags: ['Todos'],
        summary: 'Get all todos',
        description: 'Retrieve a list of all TODO items',
        responses: {
          '200': {
            description: 'List of todos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Todo',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Todos'],
        summary: 'Create a new todo',
        description: 'Create a new TODO item',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateTodoInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Todo created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Todo',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/todos/{id}': {
      put: {
        tags: ['Todos'],
        summary: 'Update a todo',
        description: 'Update an existing TODO item',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID of the todo to update',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateTodoInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Todo updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Todo',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '404': {
            description: 'Todo not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Todos'],
        summary: 'Delete a todo',
        description: 'Delete a TODO item',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID of the todo to delete',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Todo deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Todo deleted successfully',
                    },
                    todo: {
                      $ref: '#/components/schemas/Todo',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid UUID format',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '404': {
            description: 'Todo not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Todo: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique identifier for the todo',
          },
          text: {
            type: 'string',
            description: 'The todo text content',
            example: 'Buy groceries',
          },
          completed: {
            type: 'boolean',
            description: 'Whether the todo is completed',
            example: false,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the todo was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the todo was last updated',
          },
        },
        required: ['id', 'text', 'completed', 'createdAt', 'updatedAt'],
      },
      CreateTodoInput: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            minLength: 1,
            maxLength: 500,
            description: 'The todo text content',
            example: 'Buy groceries',
          },
        },
        required: ['text'],
      },
      UpdateTodoInput: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            minLength: 1,
            maxLength: 500,
            description: 'The todo text content',
            example: 'Buy groceries and cook dinner',
          },
          completed: {
            type: 'boolean',
            description: 'Whether the todo is completed',
            example: true,
          },
        },
        minProperties: 1,
      },
      Error: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error',
          },
          message: {
            type: 'string',
            example: 'An error occurred',
          },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error',
          },
          message: {
            type: 'string',
            example: 'Validation failed',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                },
                path: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};
