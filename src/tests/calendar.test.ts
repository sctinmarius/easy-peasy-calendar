import { after, afterEach, before, describe, it } from 'node:test';
import assert from 'node:assert';
import { faker } from '@faker-js/faker';
import { FastifyInstance } from 'fastify';

import { TestUtil } from './util/test.util';
import { prisma } from '../client';
import { CalendarEntryFactory, CalendarFactory } from './factory';

describe('[calendar]', async () => {
  let server: FastifyInstance;

  before(async () => {
    server = await TestUtil.before();
  });

  after(async () => {
    await TestUtil.teardown(server);
  });

  afterEach(async () => {
    await prisma.calendar.deleteMany({});
  });

  it('GET /v1/calendars', async (t) => {
    await t.test('Should retrieve all calendars', async () => {
      await prisma.calendar.createMany({
        data: CalendarFactory.generateMany(3),
      });

      const response = await server.inject({
        method: 'GET',
        url: '/v1/calendars',
        headers: {
          authorization: TestUtil.getBasicAuthHeader(),
        },
      });

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.json().calendars.length, 3);
    });

    await t.test('Should return empty array if no calendars', async () => {
      await prisma.calendar.deleteMany({});

      const response = await server.inject({
        method: 'GET',
        url: '/v1/calendars',
        headers: {
          authorization: TestUtil.getBasicAuthHeader(),
        },
      });

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.json().calendars.length, 0);
    });

    await t.test('Should return 401 if not authenticated', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/calendars',
      });

      assert.strictEqual(response.statusCode, 401);
    });

    await t.test('Should return 401 if the username and pass are wrong', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/calendars',
        headers: {
          authorization: TestUtil.getBasicAuthHeader('wrong-username', 'wrong-password'),
        },
      });

      assert.strictEqual(response.statusCode, 401);
    });
  });

  it('POST /v1/calendars', async (t) => {
    await t.test('Should create a calendar', async () => {
      const calendar = CalendarFactory.generateOne();

      const response = await server.inject({
        method: 'POST',
        url: '/v1/calendars',
        payload: {
          name: calendar.name,
        },
        headers: {
          authorization: TestUtil.getBasicAuthHeader(),
        },
      });

      assert.strictEqual(response.statusCode, 201);
      assert.deepStrictEqual(response.json(), {
        uuid: response.json().uuid,
        name: calendar.name,
      });
    });

    await t.test('Should return 400 if name is missing', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calendars',
        payload: {},
      });

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.json().message, 'Validation error');
    });

    await t.test('Should return 400 if name is empty', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calendars',
        payload: {
          name: '',
        },
      });

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.json().message, 'Validation error');
    });

    await t.test('Should return 401 if not authenticated', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calendars',
        payload: {
          name: 'Test Calendar',
        },
      });

      assert.strictEqual(response.statusCode, 401);
    });

    await t.test('Should return 401 if the username and pass are wrong', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calendars',
        headers: {
          authorization: TestUtil.getBasicAuthHeader('wrong-username', 'wrong-password'),
        },
        payload: {
          name: 'Test Calendar',
        },
      });

      assert.strictEqual(response.statusCode, 401);
    });
  });

  it('GET /v1/calendars/:uuid', async (t) => {
    await t.test('Should retrieve a calendar by UUID', async () => {
      const calendar = await prisma.calendar.create({
        data: CalendarFactory.generateOne(),
      });

      const response = await server.inject({
        method: 'GET',
        url: `/v1/calendars/${calendar.uuid}`,
        headers: {
          authorization: TestUtil.getBasicAuthHeader(),
        },
      });

      assert.strictEqual(response.statusCode, 200);
      assert.deepStrictEqual(response.json(), {
        uuid: calendar.uuid,
        name: calendar.name,
      });
    });

    await t.test('Should return 404 if calendar not found', async () => {
      const notFoundUuid = faker.string.uuid();
      const response = await server.inject({
        method: 'GET',
        url: `/v1/calendars/${notFoundUuid}`,
        headers: {
          authorization: TestUtil.getBasicAuthHeader(),
        },
      });

      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.json().message, 'Calendar not found');
    });

    await t.test('Should return 400 if UUID is invalid', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/calendars/invalid-uuid',
      });

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.json().message, 'Validation error');
    });

    await t.test('Should return 401 if not authenticated', async () => {
      const calendar = await prisma.calendar.create({
        data: CalendarFactory.generateOne(),
      });

      const response = await server.inject({
        method: 'GET',
        url: `/v1/calendars/${calendar.uuid}`,
      });

      assert.strictEqual(response.statusCode, 401);
    });

    await t.test('Should return 401 if the username and pass are wrong', async () => {
      const calendar = await prisma.calendar.create({
        data: CalendarFactory.generateOne(),
      });

      const response = await server.inject({
        method: 'GET',
        url: `/v1/calendars/${calendar.uuid}`,
        headers: {
          authorization: TestUtil.getBasicAuthHeader('wrong-username', 'wrong-password'),
        },
      });

      assert.strictEqual(response.statusCode, 401);
    });
  });

  it('PUT /v1/calendars/:uuid', async (t) => {
    await t.test('Should update a calendar', async () => {
      const calendar = await prisma.calendar.create({
        data: CalendarFactory.generateOne(),
      });

      const updatedCalendar = {
        name: faker.lorem.word(),
      };

      const response = await server.inject({
        method: 'PUT',
        url: `/v1/calendars/${calendar.uuid}`,
        payload: updatedCalendar,
        headers: {
          authorization: TestUtil.getBasicAuthHeader(),
        },
      });

      assert.strictEqual(response.statusCode, 200);
      assert.deepStrictEqual(response.json(), {
        uuid: calendar.uuid,
        name: updatedCalendar.name,
      });
    });

    await t.test('Should return 404 if calendar not found', async () => {
      const notFoundUuid = faker.string.uuid();
      const response = await server.inject({
        method: 'PUT',
        url: `/v1/calendars/${notFoundUuid}`,
        payload: {
          name: faker.lorem.word(),
        },
        headers: {
          authorization: TestUtil.getBasicAuthHeader(),
        },
      });

      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.json().message, 'Calendar not found');
    });

    await t.test('Should return 400 if UUID is invalid', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: '/v1/calendars/invalid-uuid',
        payload: {
          name: faker.lorem.word(),
        },
      });

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.json().message, 'Validation error');
    });

    await t.test('Should return 401 if not authenticated', async () => {
      const calendar = await prisma.calendar.create({
        data: CalendarFactory.generateOne(),
      });

      const response = await server.inject({
        method: 'PUT',
        url: `/v1/calendars/${calendar.uuid}`,
        payload: {
          name: 'Updated Calendar',
        },
      });

      assert.strictEqual(response.statusCode, 401);
    });

    await t.test('Should return 401 if the username and pass are wrong', async () => {
      const calendar = await prisma.calendar.create({
        data: CalendarFactory.generateOne(),
      });

      const response = await server.inject({
        method: 'PUT',
        url: `/v1/calendars/${calendar.uuid}`,
        headers: {
          authorization: TestUtil.getBasicAuthHeader('wrong-username', 'wrong-password'),
        },
        payload: {
          name: 'Updated Calendar',
        },
      });

      assert.strictEqual(response.statusCode, 401);
    });
  });

  it('DELETE /v1/calendars/:uuid', async (t) => {
    await t.test('Should delete a calendar', async () => {
      const calendar = await prisma.calendar.create({
        data: CalendarFactory.generateOne(),
      });

      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/calendars/${calendar.uuid}`,
        headers: {
          authorization: TestUtil.getBasicAuthHeader(),
        },
      });

      assert.strictEqual(response.statusCode, 200);
      assert.deepStrictEqual(response.json(), {
        message: 'Calendar deleted successfully',
      });
    });

    await t.test('should delete a calendar and its entries', async () => {
      const calendar = await prisma.calendar.create({
        data: CalendarFactory.generateOne(),
      });

      await prisma.calendarEntry.createMany({
        data: CalendarEntryFactory.generateMany(3, calendar),
      });

      let calendarWithEntries = await prisma.calendar.findUnique({
        where: {
          uuid: calendar.uuid,
        },
        include: {
          CalendarEntry: true,
        },
      });

      assert.deepStrictEqual(calendarWithEntries?.CalendarEntry.length, 3, 'Calendar should have 3 entries');
      assert.deepStrictEqual(calendarWithEntries.name, calendar.name);

      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/calendars/${calendar.uuid}`,
        headers: {
          authorization: TestUtil.getBasicAuthHeader(),
        },
      });

      assert.deepStrictEqual(response.statusCode, 200);
      assert.deepStrictEqual(response.json(), {
        message: 'Calendar deleted successfully',
      });

      calendarWithEntries = await prisma.calendar.findUnique({
        where: {
          uuid: calendar.uuid,
        },
        include: {
          CalendarEntry: true,
        },
      });

      assert.deepStrictEqual(calendarWithEntries, null, 'Calendar should not exist');
    });

    await t.test('Should return 404 if calendar not found', async () => {
      const notFoundUuid = faker.string.uuid();
      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/calendars/${notFoundUuid}`,
        headers: {
          authorization: TestUtil.getBasicAuthHeader(),
        },
      });

      assert.strictEqual(response.statusCode, 404);
      assert.strictEqual(response.json().message, 'Calendar not found');
    });

    await t.test('Should return 400 if UUID is invalid', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/v1/calendars/invalid-uuid',
      });

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.json().message, 'Validation error');
    });

    await t.test('Should return 401 if not authenticated', async () => {
      const calendar = await prisma.calendar.create({
        data: CalendarFactory.generateOne(),
      });

      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/calendars/${calendar.uuid}`,
      });

      assert.strictEqual(response.statusCode, 401);
    });

    await t.test('Should return 401 if the username and pass are wrong', async () => {
      const calendar = await prisma.calendar.create({
        data: CalendarFactory.generateOne(),
      });

      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/calendars/${calendar.uuid}`,
        headers: {
          authorization: TestUtil.getBasicAuthHeader('wrong-username', 'wrong-password'),
        },
      });

      assert.strictEqual(response.statusCode, 401);
    });
  });
});
