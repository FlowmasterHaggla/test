const buildApp = require('./app')

async function start () {
    const app = await buildApp()
    await app.listen({ port: 3000 })
}

start()
