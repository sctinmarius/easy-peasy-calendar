import fastify, { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import registerPlugins from './plugins';
import { prisma } from './client';

const buildServer = async ({ port, logger }: { port: number; logger: boolean | object }): Promise<FastifyInstance> => {
  const app = fastify({ logger });

  await registerPlugins(app);

  app.get('/', async function handler(request: FastifyRequest, reply: FastifyReply) {
    return { test: 'world' };
  });

  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    request.log.info({ error });
    reply.status(500).send({ error });
  });

  try {
    await prisma.$connect();
    app.log.info('Database is ready to use');
    app.log.info(`Environment: ${process.env.NODE_ENV}`);

    await app.listen({ port, host: '0.0.0.0' });
    app.log.info({
      event: `Server listening on ${port} port!`,
    });

    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

export default buildServer;
