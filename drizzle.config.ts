import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/schemas.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './local.db',
  },
} satisfies Config;