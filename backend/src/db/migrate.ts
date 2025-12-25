import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/todo_db';

const main = async () => {
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations completed!');

  await client.end();
};

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
