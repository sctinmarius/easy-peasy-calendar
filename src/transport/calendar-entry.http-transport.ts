import { FastifyReply, FastifyRequest } from 'fastify';
import { CalendarEntryService } from '../service';

export class CalendarEntryHttpTransport {
  constructor(private calendarEntryService: CalendarEntryService) {}

  async createCalendarEntry(request: FastifyRequest, reply: FastifyReply) {
    const { calendarUuid } = request.params as { calendarUuid: string };
    return await this.calendarEntryService.createCalendarEntry(calendarUuid, request.body, reply);
  }

  async getCalendarEntries(request: FastifyRequest, reply: FastifyReply) {
    const { calendarUuid } = request.params as { calendarUuid: string };
    const { start, end } = request.query as { start: string; end: string };
    return await this.calendarEntryService.getCalendarEntries(calendarUuid, start, end, reply);
  }

  async updateCalendarEntry(request: FastifyRequest, reply: FastifyReply) {
    const { calendarUuid, entryUuid } = request.params as { calendarUuid: string; entryUuid: string };
    return await this.calendarEntryService.updateCalendarEntry(calendarUuid, entryUuid, request.body, reply);
  }

  async deleteCalendarEntry(request: FastifyRequest, reply: FastifyReply) {
    const { calendarUuid, entryUuid } = request.params as { calendarUuid: string; entryUuid: string };
    return await this.calendarEntryService.deleteCalendarEntry(calendarUuid, entryUuid, reply);
  }

  async getCalendarEntriesByCalendarUuid(request: FastifyRequest, reply: FastifyReply) {
    return await this.calendarEntryService.getCalendarEntriesByCalendarUuid(request, reply);
  }
}
