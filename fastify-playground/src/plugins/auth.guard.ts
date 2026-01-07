// src/plugins/auth/auth.guard.ts
import {FastifyReply, FastifyRequest} from 'fastify'
import type {AuthUser} from './auth.plugin'

export function requireUser(
    request: FastifyRequest,
    reply: FastifyReply
): asserts request is FastifyRequest & { user: AuthUser } {
    if (!request.user) {
        reply.code(401).send({message: 'Not authenticated'})
    }
}

// auth.guard.ts
export function requireAdmin(
    request: FastifyRequest,
    response: FastifyReply
): asserts request is FastifyRequest & { user: AuthUser } {
    requireRole(request, response, 'admin')
}

export function requireRole(
    request: FastifyRequest,
    reply: FastifyReply,
    role: AuthUser['role']
): asserts request is FastifyRequest & { user: AuthUser } {
    requireUser(request, reply)

    if (request.user.role !== role) {
        reply.code(403).send({message: 'Not authenticated'})
    }
}

