import fastify, { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import registerPlugins from './plugins';
import { prisma } from './client';

const buildServer = async ({ port, logger }: { port: number; logger: boolean | object }): Promise<FastifyInstance> => {
  const app = fastify({ logger });

  await registerPlugins(app);

  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    request.log.info({ error });
    if (error.validation) {
      return reply.status(400).send({ message: 'Validation error' });
    }
    reply.status(error?.statusCode || 500).send({ message: 'An error occured' });
  });

  try {
    await prisma.$connect();
    app.log.info(`Database is ready to use on ${process.env.NODE_ENV} environment`);

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
