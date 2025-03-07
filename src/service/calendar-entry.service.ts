import { FastifyReply, FastifyRequest } from 'fastify';
import { constants as HttpStatusCodes } from 'http2';

export class CalendarEntryService {
  async createCalendarEntry(calendarUuid: string, payload: any, reply: FastifyReply) {
    return reply.status(HttpStatusCodes.HTTP_STATUS_CREATED).send({
      uuid: '123e4567-e89b-12d3-a456-426614174002',
      title: payload.title,
      start: payload.start,
      duration: payload.duration,
    });
  }

  async getCalendarEntries(calendarUuid: string, start: string, end: string, reply: FastifyReply) {
    return {
      entries: [
        {
          uuid: '123e4567-e89b-12d3-a456-426614174002',
          title: 'Meeting',
          start: '2023-10-01T10:00:00Z',
          duration: 60,
        },
        {
          uuid: '123e4567-e89b-12d3-a456-426614174003',
          title: 'Lunch',
          start: '2023-10-01T12:00:00Z',
          duration: 30,
        },
      ],
    };
  }

  async updateCalendarEntry(calendarUuid: string, entryUuid: string, payload: any, reply: FastifyReply) {
    if (!entryUuid) {
      return reply.status(HttpStatusCodes.HTTP_STATUS_NOT_FOUND).send({ message: 'Calendar entry not found' });
    }

    return {
      uuid: entryUuid,
      title: payload.title,
      start: payload.start,
      duration: payload.duration,
    };
  }

  async deleteCalendarEntry(calendarUuid: string, entryUuid: string, reply: FastifyReply) {
    if (!entryUuid) {
      return reply.status(HttpStatusCodes.HTTP_STATUS_NOT_FOUND).send({ message: 'Calendar entry not found' });
    }

    return reply.status(HttpStatusCodes.HTTP_STATUS_NO_CONTENT).send();
  }

  async getCalendarEntriesByCalendarUuid(request: FastifyRequest, reply: FastifyReply) {
    return {
      entries: [
        {
          uuid: '123e4567-e89b-12d3-a456-426614174002',
          title: 'Meeting',
          start: '2023-10-01T10:00:00Z',
          duration: 60,
        },
        {
          uuid: '123e4567-e89b-12d3-a456-426614174003',
          title: 'Lunch',
          start: '2023-10-01T12:00:00Z',
          duration: 30,
        },
      ],
    };
  }
}
