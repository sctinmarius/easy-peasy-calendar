import { after, before, describe, it } from 'node:test';
import assert from 'node:assert';
import { FastifyInstance } from 'fastify';
import { TestUtil } from './util/test.util';

describe('[calendar]', () => {
  let server: FastifyInstance;

  before(async () => {
    server = await TestUtil.before();

    await TestUtil.addSampleCalendars();
  });

  after(async () => {
    await TestUtil.teardown(server);
  });

  it('GET /v1/calendars', async (t) => {
    await t.test('Should retrieve all calendars', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/calendars',
      });

      assert.strictEqual(response.statusCode, 200);
    });
  });
});
