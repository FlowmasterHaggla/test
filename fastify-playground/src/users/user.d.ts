import 'fastify'
import type { UserRepo } from './user.repo'

declare module 'fastify' {
    interface FastifyInstance {
        userRepo: UserRepo
    }
}

