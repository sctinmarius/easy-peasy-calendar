import { after, before, describe, it } from 'node:test';
import assert from 'node:assert';
import { FastifyInstance } from 'fastify';
import { TestUtil } from './util/test.util';
import { prisma } from '../client';
import { CalendarFactory } from './factory';

describe('[calendar]', () => {
  let server: FastifyInstance;

  before(async () => {
    server = await TestUtil.before();
  });

  after(async () => {
    await TestUtil.teardown(server);
  });

  it('GET /v1/calendars', async (t) => {
    await prisma.calendar.createMany({
      data: CalendarFactory.generateMany(3),
    });

    await t.test('Should retrieve all calendars', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/calendars',
      });

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.json().calendars.length, 3);
    });

    await t.test('Should return empty array if no calendars', async () => {
      await prisma.calendar.deleteMany({});

      const response = await server.inject({
        method: 'GET',
        url: '/v1/calendars',
      });

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.json().calendars.length, 0);
    });

    // await t.test('Should return 500 if error occurs', async () => {
    //   const response = await server.inject({
    //     method: 'GET',
    //     url: '/v1/calendars',
    //   });

    //   assert.strictEqual(response.statusCode, 500);
    //   assert.strictEqual(response.json().error, 'Internal Server Error');
    // });

    // await t.test('Should return 400 if invalid query params', async () => {
    //   const response = await server.inject({
    //     method: 'GET',
    //     url: '/v1/calendars?offset=invalid&limit=invalid',
    //   });

    //   assert.strictEqual(response.statusCode, 400);
    //   assert.strictEqual(response.json().error, 'Bad Request');
    // });
  });
});
