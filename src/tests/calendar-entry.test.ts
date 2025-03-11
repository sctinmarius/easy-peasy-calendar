import { after, afterEach, before, describe, it } from 'node:test';
import assert from 'node:assert';
import { FastifyInstance } from 'fastify';
import { TestUtil } from './util/test.util';
import { prisma } from '../client';
import { CalendarEntryFactory, CalendarFactory } from './factory';
import { faker } from '@faker-js/faker';

describe('[Calendar Entry]', async () => {
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

  it('POST /v1/calendars/{calendarUuid}/entries', async (t) => {
    await t.test('Should create a new calendar entry', async () => {
      const calendar = CalendarFactory.generateOne();
      await prisma.calendar.create({
        data: calendar,
      });

      const calendarEntry = {
        title: 'Test Entry',
        start_date: new Date(),
        end_date: faker.date.future(),
        recurrence_rule: 'FREQ=DAILY;INTERVAL=3;COUNT=3',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/v1/calendars/${calendar.uuid}/entries`,
        payload: calendarEntry,
      });

      assert.deepStrictEqual(response.statusCode, 201);
      assert.deepStrictEqual(response.json().title, calendarEntry.title);
      assert.deepStrictEqual(response.json().recurrence_rule, calendarEntry.recurrence_rule);
    });

    await t.test('Should return 404 if calendar does not exist', async () => {
      const invalidCalendarUuid = faker.string.uuid();

      const response = await server.inject({
        method: 'POST',
        url: `/v1/calendars/${invalidCalendarUuid}/entries`,
        payload: {
          title: 'Test Entry',
          start_date: new Date(),
          end_date: faker.date.future(),
          recurrence_rule: 'FREQ=DAILY;INTERVAL=3;COUNT=3',
        },
      });

      assert.deepStrictEqual(response.statusCode, 404);
      assert.deepStrictEqual(response.json().message, 'Calendar not found');
    });

    await t.test('Should return 400 if payload is invalid', async () => {
      const calendar = CalendarFactory.generateOne();
      await prisma.calendar.create({
        data: calendar,
      });

      const invalidPayload = {
        title: '',
        start_date: 'invalid-date',
        end_date: 'invalid-date',
        recurrence_rule: '',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/v1/calendars/${calendar.uuid}/entries`,
        payload: invalidPayload,
      });

      assert.deepStrictEqual(response.statusCode, 400);
      assert.deepStrictEqual(response.json().message, 'Validation error');
    });

    await t.test('Should return 400 if calendarUuid is invalid', async () => {
      const invalidCalendarUuid = 'invalid-uuid';

      const response = await server.inject({
        method: 'POST',
        url: `/v1/calendars/${invalidCalendarUuid}/entries`,
        payload: {
          title: 'Test Entry',
          start_date: new Date(),
          end_date: faker.date.future(),
          recurrence_rule: 'FREQ=DAILY;INTERVAL=3;COUNT=3',
        },
      });

      assert.deepStrictEqual(response.statusCode, 400);
      assert.deepStrictEqual(response.json().message, 'Validation error');
    });
  });

  it('GET /v1/calendars/{calendarUuid}/entries', async (t) => {
    await t.test('Should retrieve empty calendar entries if not found any entry', async () => {
      const calendar = CalendarFactory.generateOne();
      await prisma.calendar.create({
        data: calendar,
      });

      const response = await server.inject({
        method: 'GET',
        url: `/v1/calendars/${calendar.uuid}/entries`,
        query: {
          start_date: '2023-10-01',
          end_date: '2024-05-10',
        },
      });

      assert.deepStrictEqual(response.statusCode, 200);
      assert.deepStrictEqual(response.json().entries.length, 0);
    });

    await t.test('Should retrieve calendar entries', { skip: true }, async () => {
      const calendar = CalendarFactory.generateOne();
      await prisma.calendar.create({
        data: calendar,
      });

      await prisma.calendarEntry.createMany({
        data: [
          {
            title: 'Test Entry 1',
            calendarUuid: calendar.uuid,
            startDate: new Date('2023-10-02'),
            endDate: new Date('2023-10-05'),
            recurrenceRule: 'FREQ=DAILY;INTERVAL=3;COUNT=3',
          },
          {
            title: 'Test Entry 2',
            calendarUuid: calendar.uuid,
            startDate: new Date('2024-05-01'),
            endDate: new Date('2024-05-10'),
            recurrenceRule: 'FREQ=DAILY;INTERVAL=3;COUNT=3',
          },
        ],
      });

      const response = await server.inject({
        method: 'GET',
        url: `/v1/calendars/${calendar.uuid}/entries`,
        query: {
          start_date: '2023-10-01',
          end_date: '2024-05-10',
        },
      });

      assert.deepStrictEqual(response.statusCode, 200);
      assert.deepStrictEqual(response.json().entries.length, 2);
    });

    await t.test('Should return 404 if calendar does not exist', async () => {
      const notFoundCalendarUuid = faker.string.uuid();

      const response = await server.inject({
        method: 'GET',
        url: `/v1/calendars/${notFoundCalendarUuid}/entries`,
        query: {
          start_date: '2023-10-01',
          end_date: '2024-05-10',
        },
      });

      assert.deepStrictEqual(response.statusCode, 404);
      assert.deepStrictEqual(response.json().message, 'Calendar not found');
    });

    await t.test('Should return 400 if query parameters are invalid', async () => {
      const calendar = CalendarFactory.generateOne();
      await prisma.calendar.create({
        data: calendar,
      });

      const response = await server.inject({
        method: 'GET',
        url: `/v1/calendars/${calendar.uuid}/entries`,
        query: {
          start_date: 'invalid-date',
          end_date: 'invalid-date',
        },
      });

      assert.deepStrictEqual(response.statusCode, 400);
      assert.deepStrictEqual(response.json().message, 'Validation error');
    });

    await t.test('Should return 400 if calendarUuid is invalid', async () => {
      const invalidCalendarUuid = 'invalid-uuid';

      const response = await server.inject({
        method: 'GET',
        url: `/v1/calendars/${invalidCalendarUuid}/entries`,
        query: {
          start_date: '2023-10-01',
          end_date: '2024-05-10',
        },
      });

      assert.deepStrictEqual(response.statusCode, 400);
      assert.deepStrictEqual(response.json().message, 'Validation error');
    });
  });

  it('PUT /v1/calendars/{calendarUuid}/entries/{entryUuid}', async (t) => {
    await t.test('Should update a calendar entry', async () => {
      const calendar = CalendarFactory.generateOne();
      await prisma.calendar.create({
        data: calendar,
      });

      const calendarEntry = CalendarEntryFactory.generateOne(calendar);
      const createdEntry = await prisma.calendarEntry.create({
        data: calendarEntry,
      });

      const updatedEntry = {
        title: 'Updated Entry',
        start_date: new Date('2020-10-01'),
        end_date: new Date('2020-10-02'),
        recurrence_rule: 'FREQ=DAILY;INTERVAL=3;COUNT=3',
      };

      const response = await server.inject({
        method: 'PUT',
        url: `/v1/calendars/${calendar.uuid}/entries/${createdEntry.uuid}`,
        payload: updatedEntry,
      });

      assert.strictEqual(response.statusCode, 204);
    });

    await t.test('Should return 409 if event overlaps with another event', async () => {
      const calendar = CalendarFactory.generateOne();
      await prisma.calendar.create({
        data: calendar,
      });

      const calendarEntry1 = CalendarEntryFactory.generateOne(calendar);
      await prisma.calendarEntry.create({
        data: calendarEntry1,
      });

      const calendarEntry2 = CalendarEntryFactory.generateOne(calendar);
      const createdEntry2 = await prisma.calendarEntry.create({
        data: calendarEntry2,
      });

      const overlappingEntry = {
        title: 'Overlapping Entry',
        start_date: calendarEntry1.startDate.toISOString(),
        end_date: calendarEntry1.endDate.toISOString(),
        recurrence_rule: 'FREQ=DAILY;INTERVAL=3;COUNT=3',
      };

      const response = await server.inject({
        method: 'PUT',
        url: `/v1/calendars/${calendar.uuid}/entries/${createdEntry2.uuid}`,
        payload: overlappingEntry,
      });

      assert.strictEqual(response.statusCode, 409);
      assert.strictEqual(response.json().message, 'The event already exist');
    });

    await t.test('Should update overlapping event if force is true', async () => {
      const calendar = CalendarFactory.generateOne();
      await prisma.calendar.create({
        data: calendar,
      });

      const calendarEntry1 = CalendarEntryFactory.generateOne(calendar);
      await prisma.calendarEntry.create({
        data: calendarEntry1,
      });

      const calendarEntry2 = CalendarEntryFactory.generateOne(calendar);
      const createdEntry2 = await prisma.calendarEntry.create({
        data: calendarEntry2,
      });

      const overlappingEntry = {
        title: 'Overlapping Entry',
        start_date: calendarEntry1.startDate.toISOString(),
        end_date: calendarEntry1.endDate.toISOString(),
        recurrence_rule: 'FREQ=DAILY;INTERVAL=3;COUNT=3',
      };

      const response = await server.inject({
        method: 'PUT',
        url: `/v1/calendars/${calendar.uuid}/entries/${createdEntry2.uuid}?force=true`,
        payload: overlappingEntry,
      });

      assert.strictEqual(response.statusCode, 204);
    });

    await t.test('Should return 404 if calendar does not exist', async () => {
      const calendarUuidNotFound = faker.string.uuid();
      const entryUuid = faker.string.uuid();

      const response = await server.inject({
        method: 'PUT',
        url: `/v1/calendars/${calendarUuidNotFound}/entries/${entryUuid}`,
        payload: {
          title: 'Updated Entry',
          start_date: new Date(),
          end_date: faker.date.future(),
          recurrence_rule: 'FREQ=DAILY;INTERVAL=3;COUNT=3',
        },
      });

      assert.deepStrictEqual(response.statusCode, 404);
      assert.deepStrictEqual(response.json().message, 'Calendar entry not found');
    });

    await t.test('Should return 404 if calendar entry does not exist', async () => {
      const calendar = CalendarFactory.generateOne();
      await prisma.calendar.create({
        data: calendar,
      });

      const entryUuid = faker.string.uuid();

      const response = await server.inject({
        method: 'PUT',
        url: `/v1/calendars/${calendar.uuid}/entries/${entryUuid}`,
        payload: {
          title: 'Updated Entry',
          start_date: new Date(),
          end_date: faker.date.future(),
          recurrence_rule: 'FREQ=DAILY;INTERVAL=3;COUNT=3',
        },
      });

      assert.deepStrictEqual(response.statusCode, 404);
      assert.deepStrictEqual(response.json().message, 'Calendar entry not found');
    });
  });

  it('DELETE /v1/calendars/{calendarUuid}/entries/{entryUuid}', async (t) => {
    await t.test('Should delete a calendar entry', async () => {
      const calendar = CalendarFactory.generateOne();
      await prisma.calendar.create({
        data: calendar,
      });

      const calendarEntry = await prisma.calendarEntry.create({
        data: {
          title: 'Test Entry',
          calendarUuid: calendar.uuid,
          startDate: new Date(),
          endDate: faker.date.future(),
          recurrenceRule: 'FREQ=DAILY;INTERVAL=3;COUNT=3',
        },
      });

      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/calendars/${calendar.uuid}/entries/${calendarEntry.uuid}`,
      });

      assert.deepStrictEqual(response.statusCode, 204);
    });

    await t.test('Should return 404 if calendar does not exist', async () => {
      const calendarUuidNotFound = faker.string.uuid();
      const entryUuid = faker.string.uuid();

      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/calendars/${calendarUuidNotFound}/entries/${entryUuid}`,
      });

      assert.deepStrictEqual(response.statusCode, 404);
      assert.deepStrictEqual(response.json().message, 'Calendar entry not found');
    });

    await t.test('Should return 404 if calendar entry does not exist', async () => {
      const calendar = CalendarFactory.generateOne();
      await prisma.calendar.create({
        data: calendar,
      });

      const entryUuid = faker.string.uuid();

      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/calendars/${calendar.uuid}/entries/${entryUuid}`,
      });

      assert.deepStrictEqual(response.statusCode, 404);
      assert.deepStrictEqual(response.json().message, 'Calendar entry not found');
    });

    await t.test('Should return 400 if calendarUuid is invalid', async () => {
      const invalidCalendarUuid = 'invalid-uuid';
      const entryUuid = faker.string.uuid();

      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/calendars/${invalidCalendarUuid}/entries/${entryUuid}`,
      });

      assert.deepStrictEqual(response.statusCode, 400);
      assert.deepStrictEqual(response.json().message, 'Validation error');
    });

    await t.test('Should return 400 if entryUuid is invalid', async () => {
      const calendar = CalendarFactory.generateOne();
      await prisma.calendar.create({
        data: calendar,
      });

      const invalidEntryUuid = 'invalid-uuid';

      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/calendars/${calendar.uuid}/entries/${invalidEntryUuid}`,
      });

      assert.deepStrictEqual(response.statusCode, 400);
      assert.deepStrictEqual(response.json().message, 'Validation error');
    });
  });
});
