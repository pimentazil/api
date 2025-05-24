// src/env.ts
import { config as loadEnv } from './env'
import { z } from 'zod'

// Carrega as variáveis do arquivo .env
loadEnv()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Erro nas variáveis de ambiente:', _env.error.format())
  process.exit(1)
}

export const env = _env.data
