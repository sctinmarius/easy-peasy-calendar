import { FastifyReply, FastifyRequest } from 'fastify';
import { constants as HttpStatusCodes } from 'http2';
import { prisma } from '../client';
import { CalendarEntry } from '@prisma/client';

type CalendarEntryPayload = {
  title: string;
  start_date: string;
  end_date: string;
  recurrence_rule: string | null;
};

type CalendarEntryResponse = {
  uuid: string;
} & CalendarEntryPayload;

export class CalendarEntryService {
  async createCalendarEntry(calendarUuid: string, payload: CalendarEntryPayload, reply: FastifyReply): Promise<CalendarEntryResponse> {
    const foundCalendar = await prisma.calendar.findUnique({
      where: {
        uuid: calendarUuid,
      },
    });

    if (!foundCalendar) {
      return reply.status(HttpStatusCodes.HTTP_STATUS_NOT_FOUND).send({ message: 'Calendar not found' });
    }

    return reply.status(HttpStatusCodes.HTTP_STATUS_CREATED).send(
      this.getCalendarEntryResponse(
        await prisma.calendarEntry.create({
          data: {
            title: payload.title,
            calendarUuid: calendarUuid,
            startDate: payload.start_date,
            endDate: payload.end_date,
            recurrenceRule: payload.recurrence_rule,
          },
        })
      )
    );
  }

  async getCalendarEntries(calendarUuid: string, startDate: string, endDate: string, reply: FastifyReply) {
    const foundCalendar = await prisma.calendar.findUnique({
      where: {
        uuid: calendarUuid,
      },
    });

    if (!foundCalendar) {
      return reply.status(HttpStatusCodes.HTTP_STATUS_NOT_FOUND).send({ message: 'Calendar not found' });
    }

    const foundEntries = await prisma.calendarEntry.findMany({
      where: {
        calendarUuid: calendarUuid,
        startDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    return {
      entries: foundEntries.map((entry) => this.getCalendarEntryResponse(entry)),
    };
  }
  async updateCalendarEntry(calendarUuid: string, entryUuid: string, force: boolean, payload: CalendarEntryPayload, reply: FastifyReply) {
    const foundCalendarWithEntry = await prisma.calendar.findUnique({
      where: {
        uuid: calendarUuid,
      },
      include: {
        CalendarEntry: {
          where: {
            uuid: entryUuid,
          },
        },
      },
    });

    if (!foundCalendarWithEntry?.CalendarEntry.length) {
      return reply.status(HttpStatusCodes.HTTP_STATUS_NOT_FOUND).send({ message: 'Calendar entry not found' });
    }

    if (!force) {
      const overlappingEntries = await prisma.calendarEntry.findMany({
        where: {
          calendarUuid: calendarUuid,
          AND: [
            {
              startDate: {
                lte: new Date(payload.end_date),
              },
            },
            {
              endDate: {
                gte: new Date(payload.start_date),
              },
            },
            {
              uuid: {
                not: entryUuid,
              },
            },
          ],
        },
      });

      if (overlappingEntries.length > 0) {
        return reply.status(HttpStatusCodes.HTTP_STATUS_CONFLICT).send({ message: 'The event already exist' });
      }
    }

    await prisma.calendarEntry.update({
      where: {
        uuid: entryUuid,
      },
      data: {
        title: payload.title,
        startDate: new Date(payload.start_date),
        endDate: new Date(payload.end_date),
        recurrenceRule: payload.recurrence_rule,
      },
    });

    return reply.status(HttpStatusCodes.HTTP_STATUS_NO_CONTENT).send();
  }

  async deleteCalendarEntry(calendarUuid: string, entryUuid: string, reply: FastifyReply) {
    const foundCalendarWithEntry = await prisma.calendar.findUnique({
      where: {
        uuid: calendarUuid,
      },
      include: {
        CalendarEntry: {
          where: {
            uuid: entryUuid,
          },
        },
      },
    });

    if (!foundCalendarWithEntry?.CalendarEntry.length) {
      return reply.status(HttpStatusCodes.HTTP_STATUS_NOT_FOUND).send({ message: 'Calendar entry not found' });
    }

    return reply.status(HttpStatusCodes.HTTP_STATUS_NO_CONTENT).send();
  }
  private getCalendarEntryResponse(entry: CalendarEntry): CalendarEntryResponse {
    return {
      uuid: entry.uuid,
      title: entry.title,
      start_date: entry.startDate.toISOString(),
      end_date: entry.endDate.toISOString(),
      recurrence_rule: entry.recurrenceRule,
    };
  }
}
