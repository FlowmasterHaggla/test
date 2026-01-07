// src/plugins/auth.plugin.ts
import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

export type AuthUser = {
    id: string
    role: 'admin' | 'user'
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorateRequest('user', null)

    fastify.addHook('preHandler', async (request) => {
        // Demo: immer eingeloggt
        // request.user = { id: '123', role: 'user' }
    })
}

export default fp(authPlugin)
