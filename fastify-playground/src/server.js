import { build } from './app.ts';

async function start () {
    const app = await build()
    await app.listen({ port: 3000 })
}

start()
