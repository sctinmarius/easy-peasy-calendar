import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';

export default async function swaggerPlugin(app: FastifyInstance) {
  app.register(fastifySwagger, {
    openapi: {
      components: {
        securitySchemes: {
          basicAuth: {
            type: 'http',
            scheme: 'basic',
            description: 'Basic authentication for the API. Use your username and password to authenticate.',
          },
        },
      },
      security: [
        {
          basicAuth: [],
        },
      ],
    },
  });
}
