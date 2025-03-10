import { after, before, describe, it } from 'node:test';
import assert from 'node:assert';

import { FastifyInstance } from 'fastify';
import { TestUtil } from './util/test.util';

describe('Database setup', () => {
  let server: FastifyInstance;

  before(async () => {
    server = await TestUtil.before();
  });

  after(async () => {
    await TestUtil.teardown(server);
  });

  it('suite 1 test', async (t) => {
    await t.test('Should test', async () => {
      console.log('Running migrations...');

      assert.deepStrictEqual(true, true);
    });
  });
});
