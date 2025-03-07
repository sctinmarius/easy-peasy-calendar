import { FastifyReply, FastifyRequest } from 'fastify';
import { constants as HttpStatusCodes } from 'http2';

export class CalendarService {
  async getCalendars(request: FastifyRequest, reply: FastifyReply) {
    return {
      offset: 0,
      limit: 10,
      total: 2,
      totalPages: 1,
      calendars: [
        { uuid: '123e4567-e89b-12d3-a456-426614174000', name: 'My Calendar' },
        { uuid: '123e4567-e89b-12d3-a456-426614174001', name: 'Work Calendar' },
      ],
    };
  }

  async createCalendar(payload: any) {
    return { uuid: '123e4567-e89b-12d3-a456-426614174000', name: 'test' };
  }

  async getCalendarByUuid(calendarUuid: string, reply: FastifyReply) {
    if (!calendarUuid) {
      return reply.status(HttpStatusCodes.HTTP_STATUS_NOT_FOUND).send({ message: 'Calendar not found' });
    }

    return { uuid: calendarUuid, name: 'My Calendar' };
  }

  async updateCalendar(calendarUuid: string, payload: any, reply: FastifyReply) {
    if (!calendarUuid) {
      return reply.status(HttpStatusCodes.HTTP_STATUS_NOT_FOUND).send({ message: 'Calendar not found' });
    }

    return { uuid: calendarUuid, name: payload.name };
  }

  async deleteCalendar(calendarUuid: string) {
    return { message: 'Calendar deleted' };
  }
}
