import fp from 'fastify-plugin'
import postgres from '@fastify/postgres'
import type { FastifyPluginAsync } from 'fastify'

type DbOpts = { connectionString: string }

const postgresPlugin: FastifyPluginAsync<DbOpts> = async (fastify, opts) => {
    await fastify.register(postgres, {
        connectionString: opts.connectionString
    })
}

export default fp(postgresPlugin)
