import { FastifyInstance } from 'fastify';
import fastifyOpenapiGlue, { FastifyOpenapiGlueOptions } from 'fastify-openapi-glue';
import path from 'path';
import { fileURLToPath } from 'url';
import { CalendarEntryHttpTransport, CalendarHttpTransport } from '../transport';
import { calendarEntryService, calendarService } from '../services';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function openapiGluePlugin(app: FastifyInstance) {
  const calendarHttpTransport = new CalendarHttpTransport(calendarService);
  const calendarEntryHttpTransport = new CalendarEntryHttpTransport(calendarEntryService);

  const fastifyOpenapiGlueOptions: FastifyOpenapiGlueOptions = {
    specification: path.join(__dirname, '../../openapi/v1.yaml'),
    serviceHandlers: {
      getCalendars: calendarHttpTransport.getCalendars.bind(calendarHttpTransport),
      createCalendar: calendarHttpTransport.createCalendar.bind(calendarHttpTransport),
      getCalendarByUuid: calendarHttpTransport.getCalendarByUuid.bind(calendarHttpTransport),
      updateCalendar: calendarHttpTransport.updateCalendar.bind(calendarHttpTransport),
      deleteCalendar: calendarHttpTransport.deleteCalendar.bind(calendarHttpTransport),
      createCalendarEntry: calendarEntryHttpTransport.createCalendarEntry.bind(calendarEntryHttpTransport),
      getCalendarEntries: calendarEntryHttpTransport.getCalendarEntries.bind(calendarEntryHttpTransport),
      updateCalendarEntry: calendarEntryHttpTransport.updateCalendarEntry.bind(calendarEntryHttpTransport),
      deleteCalendarEntry: calendarEntryHttpTransport.deleteCalendarEntry.bind(calendarEntryHttpTransport),
      getCalendarEntriesByCalendarUuid: calendarEntryHttpTransport.getCalendarEntriesByCalendarUuid.bind(calendarEntryHttpTransport),
    },
    prefix: 'v1',
  };

  app.register(fastifyOpenapiGlue, fastifyOpenapiGlueOptions);
}
