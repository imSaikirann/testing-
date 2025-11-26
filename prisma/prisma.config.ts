import { defineConfig, env } from 'prisma/config';
import 'dotenv/config'; // For loading environment variables from .env

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'), // Retrieves the database URL from the DATABASE_URL environment variable
  },
  migrations: {
    path: 'prisma/migrations', // Path to your migration files
  },
});