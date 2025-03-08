import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';

export default async function swaggerPlugin(app: FastifyInstance) {
  app.register(fastifySwagger);
}
