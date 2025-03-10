import { FastifyInstance } from 'fastify';
import buildServer from '../../server';
import { prisma } from '../../client';

export class TestUtil {
  static async before() {
    process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
    const server: FastifyInstance = await buildServer({ port: 3000, logger: true });

    return server;
  }

  static async teardown(server: FastifyInstance) {
    server.close();
  }

  static async addSampleCalendars() {
    await prisma.calendar.createMany({
      data: [{ name: 'Sample Calendar 1' }, { name: 'Sample Calendar 2' }, { name: 'Sample Calendar 3' }],
    });
  }
}
