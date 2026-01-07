// routes/health.js
module.exports = async function (fastify) {
    fastify.get('/health', async () => ({ ok: true }))
}
