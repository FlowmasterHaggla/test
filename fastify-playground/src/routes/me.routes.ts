// src/routes/me.routes.ts
import {FastifyPluginAsync} from 'fastify'
import {requireUser} from "../plugins/auth.guard";

const meRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/me', async (request, reply) => {
        requireUser(request, reply)

        return {
            userId: request.user.id,
            role: request.user.role
        }
    })

}

export default meRoutes
