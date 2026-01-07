import fp from 'fastify-plugin'
import type {FastifyPluginAsync} from 'fastify'
import type {CreateUser, PatchUser, UserRepo} from './user.repo'
import {PgUserRepo} from './user.repo.pg'
import {MemoryUserRepo} from './user.repo.memory'
import {UserRepoMode} from "./user.repo.mode";

type UsersPluginOpts =
     { mode: UserRepoMode }
const usersPlugin: FastifyPluginAsync<UsersPluginOpts> = async (fastify, opts) => {
    let repo: UserRepo

    if (opts.mode === UserRepoMode.MEMORY) {
        repo = new MemoryUserRepo()
    } else {
        // @fastify/postgres decorates fastify.pg (Pool)
        repo = new PgUserRepo(fastify.pg.pool)
    }

    fastify.decorate('userRepo', repo)

    fastify.post<{
        Body: CreateUser
    }>('/users', {schema: {}}, async (request, reply) => {
        const user = await fastify.userRepo.create(request.body)
        reply.code(201).header('Location', `/users/${user.id}`)
        return {id: user.id, name: user.name}
    })

    fastify.patch<{ Params: { id: string }; Body: PatchUser }>('/users/:userId', {schema: {}}, async (request, reply) => {
        const { id } = request.params
        const user = await fastify.userRepo.patch(id, request.body)
        await fastify.userRepo.patch(id, request.body)
        reply.code(204).send()
    })
}
export default fp(usersPlugin)
