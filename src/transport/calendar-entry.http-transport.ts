import { FastifyReply, FastifyRequest } from 'fastify';
import { CalendarEntryService } from '../service';

export class CalendarEntryHttpTransport {
  constructor(private calendarEntryService: CalendarEntryService) {}

  async createCalendarEntry(request: FastifyRequest, reply: FastifyReply) {
    const { calendar_uuid: calendarUuid } = request.params as { calendar_uuid: string };
    return await this.calendarEntryService.createCalendarEntry(calendarUuid, request.body as any, reply);
  }

  async getCalendarEntries(request: FastifyRequest, reply: FastifyReply) {
    const { calendar_uuid: calendarUuid } = request.params as { calendar_uuid: string };
    const { start_date: startDate, end_date: endDate } = request.query as { start_date: string; end_date: string };

    return await this.calendarEntryService.getCalendarEntries(calendarUuid, startDate, endDate, reply);
  }

  async updateCalendarEntry(request: FastifyRequest, reply: FastifyReply) {
    const { calendarUuid, entryUuid } = request.params as { calendarUuid: string; entryUuid: string };
    return await this.calendarEntryService.updateCalendarEntry(calendarUuid, entryUuid, request.body, reply);
  }

  async deleteCalendarEntry(request: FastifyRequest, reply: FastifyReply) {
    const { calendar_uuid: calendarUuid, entry_uuid: entryUuid } = request.params as { calendar_uuid: string; entry_uuid: string };

    return await this.calendarEntryService.deleteCalendarEntry(calendarUuid, entryUuid, reply);
  }
}
