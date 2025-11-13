import 'dotenv/config';
import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

type Env = {
  DATABASE_URL: string;
};

const databaseUrl = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
process.env.DATABASE_URL = databaseUrl;

export default defineConfig({
  schema: path.join('prisma'),

  // Configuration for Prisma migrations.
  migrations: {
    path: path.join('db', 'migrations'),
    seed: 'ts-node prisma/seed.ts',
  },
  views: {
    path: path.join('db', 'views'),
  },
  typedSql: {
    path: path.join('db', 'queries'),
  },
  engine: 'classic',
  datasource: {
    url: env<Env>('DATABASE_URL'),
  },
});
