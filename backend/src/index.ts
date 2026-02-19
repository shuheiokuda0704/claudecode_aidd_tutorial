import { app } from './app.js';
import { config } from './lib/config.js';
import { logger } from './lib/logger.js';
import { client } from './db/index.js';

// Start server
const server = app.listen(config.PORT, () => {
  logger.info(
    {
      port: config.PORT,
      environment: config.NODE_ENV,
    },
    'Server started successfully',
  );
  logger.info(`Health check: http://localhost:${config.PORT}/health`);
  logger.info(`API endpoint: http://localhost:${config.PORT}/api/todos`);
  logger.info(`API documentation: http://localhost:${config.PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await client.end();
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    await client.end();
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled rejection');
});

process.on('uncaughtException', (error) => {
  logger.error({ err: error }, 'Uncaught exception');
  process.exit(1);
});
