import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import { config } from '../lib/config.js';

export const client = postgres(config.DATABASE_URL);
export const db = drizzle(client, { schema });
