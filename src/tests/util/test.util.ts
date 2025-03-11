import { FastifyInstance } from 'fastify';
import buildServer from '../../server';

export class TestUtil {
  static async before() {
    const server: FastifyInstance = await buildServer({ port: 3000, logger: true });

    return server;
  }

  static async teardown(server: FastifyInstance) {
    await server.close();
  }
}
