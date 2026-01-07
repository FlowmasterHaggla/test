const crypto = require('node:crypto')

const bodySchema = {
    type: 'object',
    additionalProperties: false,
    minProperties: 1, // für PATCH gut, für POST meist NICHT
    properties: {
        name: {type: 'string', minLength: 1},
        email: {type: 'string', format: 'email'},
        age: {type: 'integer', minimum: 0}
    }
}

module.exports = async function usersRoutes(fastify) {
    fastify.post('/users', {
        schema: {
            body: {
                ...bodySchema,
                required: ['name'],
                // bei POST wäre minProperties optional; wenn du's drin lässt, ist es ok,
                // aber required ist hier wichtiger.
            }
        },
        response: {
            201: {
                type: 'object',
                required: ['id', 'name'],
                additionalProperties: false,
                properties: {
                    id: {type: 'string'},
                    name: {type: 'string'}
                }
            }
        }
    }, async (request, reply) => {
        const id = crypto.randomUUID()
        reply.code(201).header('Location', `/users/${id}`)
        return {id, name: request.body.name}
    })

    fastify.patch('/users/:id', {
        schema: {
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    // Fastify params kommen praktisch immer als string.
                    // Wenn du wirklich Zahl willst: type: 'integer' + coerceTypes aktivieren,
                    // oder einfach string validieren und im Handler Number(...) machen.
                    id: {type: 'string', pattern: '^[0-9]+$'}
                }
            },
            body: {
                ...bodySchema,
                // PATCH: keine required fields
                required: [],
                minProperties: 1
            }
        }
    }, async (request, reply) => {
        reply.code(204)
    })
}
