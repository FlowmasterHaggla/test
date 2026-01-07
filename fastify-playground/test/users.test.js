import {afterEach, beforeEach, expect, test} from 'vitest'
import buildApp from '../src/app.ts'
import fp from 'fastify-plugin'

let app

beforeEach(async () => {
    app = await buildApp()
})

afterEach(async () => {
    await app.close()
})

test('GET /health returns ok', async () => {
    const res = await app.inject({
        method: 'GET',
        url: '/health'
    })

    expect(res.statusCode).toBe(200)
    expect(res.headers['content-type']).toContain('application/json')
    expect(res.json()).toEqual({ok: true})

    await app.close()
})

test('POST /users with valid body returns 201 + id', async () => {
    const res = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: {
            name: 'Florian',
            email: 'florian@example.com',
            age: 35
        }
    })

    expect(res.statusCode).toBe(201)

    const body = res.json()
    expect(body).toHaveProperty('id')
    expect(typeof body.id).toBe('string')
    expect(body.name).toBe('Florian')

    await app.close()
})

test('POST /users with invalid payload', async () => {
    const res = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: {name1: 'Florian'}
    })

    expect(res.statusCode).toBe(400)
    await app.close()
})

test('PATCH /users/1', async () => {
    const res = await app.inject({
        method: 'PATCH',
        url: '/api/users/123',
        payload: {name: 'Florian'}
    })

    expect(res.statusCode).toBe(204)
    await app.close()
})

test('GET /me without user', async () => {

    app = await buildApp({ authPlugin: authStub('admin') })

    const res = await app.inject({
        method: 'GET',
        url: '/me'
    })

    const body = res.json()
    expect(res.statusCode).toBe(200)
    expect(body).toHaveProperty('userId')
    expect(body).toHaveProperty('role')
    expect(body.role).toBe('admin')
})

function authStub(role) {
    return fp(async (fastify) => {
        fastify.decorateRequest('user', null)
        fastify.addHook('preHandler', async (req) => {
            req.user = {id: '1', role}
        })
    })
}