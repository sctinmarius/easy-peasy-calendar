import { FastifyReply, FastifyRequest } from 'fastify';
import { constants as HttpStatusCodes } from 'http2';

import { CalendarService } from '../service';

export class CalendarHttpTransport {
  constructor(private calendarService: CalendarService) {}

  async getCalendars(request: FastifyRequest, reply: FastifyReply) {
    return await this.calendarService.getCalendars(request, reply);
  }

  async createCalendar(request: FastifyRequest, reply: FastifyReply) {
    reply.status(HttpStatusCodes.HTTP_STATUS_CREATED);

    return await this.calendarService.createCalendar(request.body as { name: string });
  }

  async getCalendarByUuid(request: FastifyRequest, reply: FastifyReply) {
    const { calendar_uuid: calendarUuid } = request.params as { calendar_uuid: string };

    return await this.calendarService.getCalendarByUuid(calendarUuid, reply);
  }

  async updateCalendar(request: FastifyRequest, reply: FastifyReply) {
    const { calendar_uuid: calendarUuid } = request.params as { calendar_uuid: string };

    return await this.calendarService.updateCalendar(calendarUuid, request.body, reply);
  }

  async deleteCalendar(request: FastifyRequest, reply: FastifyReply) {
    const { calendar_uuid: calendarUuid } = request.params as { calendar_uuid: string };

    return await this.calendarService.deleteCalendar(calendarUuid, reply);
  }
}
