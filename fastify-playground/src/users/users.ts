import fp from 'fastify-plugin'
import type {FastifyPluginAsync} from 'fastify'
import type {UserRepo} from './user.repo'
import {PgUserRepo} from './user.repo.pg'
import {MemoryUserRepo} from './user.repo.memory'
import {UserRepoMode} from "./user.repo.mode";
import {CreateUserSchema, PatchUserSchema} from "./user.schema";
import {z} from "zod";
import {serializerCompiler, validatorCompiler, ZodTypeProvider} from "fastify-type-provider-zod";

type UsersPluginOpts =
    { mode: UserRepoMode }
const usersPlugin: FastifyPluginAsync<UsersPluginOpts> = async (fastify_, opts) => {
    const fastify = fastify_.withTypeProvider<ZodTypeProvider>();
    fastify.setValidatorCompiler(validatorCompiler)
    fastify.setSerializerCompiler(serializerCompiler)
    let repo: UserRepo

    if (opts.mode === UserRepoMode.MEMORY) {
        repo = new MemoryUserRepo()
    } else {
        // @fastify/postgres decorates fastify.pg (Pool)
        repo = new PgUserRepo(fastify.pg.pool)
    }

    fastify.decorate('userRepo', repo)

    fastify.post('/users', {
        schema: {
            body: CreateUserSchema
        }
    }, async (request, reply) => {
        const user = await fastify.userRepo.create(request.body)
        return reply.code(201).header('Location', `/users/${user.id}`).send({id: user.id, name: user.name})
    })

    fastify.patch('/users/:userId', {
        schema: {
            params: z.object({
                userId: z.string().uuid()
            }),
            body: PatchUserSchema
        }
    }, async (request, reply) => {
        await fastify.userRepo.patch(request.params.userId, request.body)
        return reply.code(204).send()
    })
}
export default fp(usersPlugin)
