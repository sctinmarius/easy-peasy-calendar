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

  static getBasicAuthHeader(username = process.env.BASIC_AUTH_USERNAME, password = process.env.BASIC_AUTH_PASSWORD): string {
    return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  }
}
