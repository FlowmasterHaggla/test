import authPlugin from './plugins/auth.plugin'
import meRoutes from './routes/me.routes'
import postgresPlugin from "./plugins/db/postgres.plugin";
import usersRoutes from './users/users'
import {UserRepoMode} from "@users/user.repo.mode";

const fastifyFactory = require('fastify')

type BuildAppOpts = {
    users?: {
        mode: UserRepoMode
    }
    db?: {
        connectionString?: string
    }
    auth?: Parameters<typeof authPlugin>[1]
}

module.exports = async function buildApp(opts: BuildAppOpts = {}) {
    const fastify = fastifyFactory({logger: true, ...opts})

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
    fastify.register(opts.auth ?? authPlugin)
    fastify.register(meRoutes)
    fastify.register(usersRoutes, {mode: opts.users?.mode})
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
