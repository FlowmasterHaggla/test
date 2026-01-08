import authPlugin from './plugins/auth.plugin'
import meRoutes from './routes/me.routes'
import postgresPlugin from "./plugins/db/postgres.plugin";
import usersRoutes from './users/users'
import {UserRepoMode} from "./users/user.repo.mode";
import {serializerCompiler, validatorCompiler, ZodTypeProvider} from "fastify-type-provider-zod";
import Fastify, {FastifyInstance, FastifyPluginAsync} from 'fastify';

type BuildAppOpts = {
    users?: {
        mode?: UserRepoMode
    }
    db?: {
        connectionString?: string
    }
    authPluginOverride?: FastifyPluginAsync;
}

const build = async (opts: BuildAppOpts = {}): Promise<FastifyInstance> => {
    let fastify: FastifyInstance = Fastify({logger: true, ...opts}).withTypeProvider<ZodTypeProvider>()
    fastify.setValidatorCompiler(validatorCompiler)
    fastify.setSerializerCompiler(serializerCompiler)

    fastify.register(async (api: any) => {
            const usersMode = opts.users?.mode ?? 'pg'

            // 👉 NUR im pg-mode wird Postgres registriert
            if (usersMode === 'pg') {
                api.register(postgresPlugin, {
                    connectionString:
                        opts.db?.connectionString ??
                        process.env.DATABASE_URL ??
                        'postgres://app:app@localhost:5432/appdb'
                })
            }
        }
    )
    // Route-Plugin registrieren
    let plugin = opts.authPluginOverride ?? authPlugin;
    fastify.register(plugin)
    fastify.register(meRoutes)
    let mode = opts.users?.mode?? UserRepoMode.PG;
    fastify.register(usersRoutes, {mode})
    fastify.register(require('./routes/health'))

    fastify.setErrorHandler((err: any, request: any, reply: any) => {
        if (err.validation) {
            return reply.status(400).send({
                error: 'Bad Request',
                message: 'Validation failed',
                details: err.validation
            })
        }
        request.log.error(err)
        reply.status(500).send({error: 'Internal Server Error'})
    })

    return fastify
}

export {build};
