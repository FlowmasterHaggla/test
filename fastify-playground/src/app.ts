import authPlugin from './plugins/auth.plugin'
import meRoutes from './routes/me.routes'

const fastifyFactory = require('fastify')

module.exports = async function buildApp(opts: { authPlugin?: any } = {}) {
    const fastify = fastifyFactory({logger: true, ...opts})

    // Route-Plugin registrieren
    fastify.register(opts.authPlugin ?? authPlugin)
    fastify.register(meRoutes)
    fastify.register(require('./routes/users'), {prefix: '/api'})
    fastify.register(require('./routes/health'))


    fastify.setErrorHandler((err:any, request:any, reply:any) => {
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


