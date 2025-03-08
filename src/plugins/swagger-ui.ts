import { FastifyInstance } from 'fastify';
import fastifySwaggerUi from '@fastify/swagger-ui';

export default async function swaggerUiPlugin(app: FastifyInstance) {
  app.register(fastifySwaggerUi, {
    routePrefix: '/v1/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
  });
}
