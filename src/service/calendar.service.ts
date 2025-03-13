import { FastifyReply } from 'fastify';
import { constants as HttpStatusCodes } from 'http2';

import { prisma } from '../client';

export type CalendarResponse = {
  offset: number;
  limit: number;
  total: number;
  total_pages: number;
  calendars: CalendarItemResponse[];
};

type CalendarItemResponse = {
  uuid: string;
  name: string;
};

export class CalendarService {
  async getCalendars(): Promise<CalendarResponse> {
    const calendars = await prisma.calendar.findMany();

    // todo implement pagination
    return {
      offset: 0,
      limit: 10,
      total: 0,
      total_pages: 0,
      calendars: calendars,
    };
  }

  async createCalendar(payload: { name: string }) {
    return await prisma.calendar.create({
      data: {
        name: payload.name,
      },
    });
  }

  async getCalendarByUuid(calendarUuid: string, reply: FastifyReply): Promise<CalendarItemResponse> {
    const calendar = await prisma.calendar.findUnique({
      where: {
        uuid: calendarUuid,
      },
    });

    if (!calendar) {
      return reply.status(HttpStatusCodes.HTTP_STATUS_NOT_FOUND).send({ message: 'Calendar not found' });
    }

    return {
      uuid: calendar.uuid,
      name: calendar.name,
    };
  }

  async updateCalendar(calendarUuid: string, payload: any, reply: FastifyReply): Promise<CalendarItemResponse> {
    const calendar = await prisma.calendar.findUnique({
      where: {
        uuid: calendarUuid,
      },
    });

    if (!calendar) {
      return reply.status(HttpStatusCodes.HTTP_STATUS_NOT_FOUND).send({ message: 'Calendar not found' });
    }

    return await prisma.calendar.update({
      where: {
        uuid: calendarUuid,
      },
      data: {
        name: payload.name,
      },
    });
  }

  async deleteCalendar(calendarUuid: string, reply: FastifyReply): Promise<{ message: string }> {
    const calendar = await prisma.calendar.findUnique({
      where: {
        uuid: calendarUuid,
      },
    });

    if (!calendar) {
      return reply.status(HttpStatusCodes.HTTP_STATUS_NOT_FOUND).send({ message: 'Calendar not found' });
    }
    await prisma.calendar.delete({
      where: {
        uuid: calendarUuid,
      },
    });

    return { message: 'Calendar deleted successfully' };
  }
}
