import { after, before, describe, it } from 'node:test';
import assert from 'node:assert';
import { FastifyInstance } from 'fastify';
import { TestUtil } from './util/test.util';

describe('[Calendar Entry]', () => {
  let server: FastifyInstance;

  before(async () => {
    server = await TestUtil.before();
  });

  after(async () => {
    await TestUtil.teardown(server);
  });

  it('GET /v1/calendars/{calendarUuid}/entries', async (t) => {
    await t.test('Should return 500 when calendarUuid is invalid', async () => {
      const invalidCalendarUuid = 'invalid-uuid';
      const response = await server.inject({
        method: 'GET',
        url: `/v1/calendars/${invalidCalendarUuid}/entries`,
      });

      assert.strictEqual(response.statusCode, 500);
    });
  });
});
