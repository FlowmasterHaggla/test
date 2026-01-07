// src/types/auth.types.d.ts
import 'fastify'
import type { AuthUser } from './auth.plugin'

declare module 'fastify' {
    interface FastifyRequest {
        user: AuthUser | null
    }
}
