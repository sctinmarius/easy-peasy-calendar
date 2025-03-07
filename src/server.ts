import fastify, { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyOpenapiGlue, { FastifyOpenapiGlueOptions } from 'fastify-openapi-glue';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import { CalendarEntryHttpTransport, CalendarHttpTransport } from './transport';
import { calendarEntryService, calendarService } from './services';

const localFile = (fileName: string) => new URL(fileName, import.meta.url).pathname;

const buildServer = async ({ port, logger }: { port: number; logger: boolean | object }): Promise<FastifyInstance> => {
  const app = fastify({ logger });

  const calendarHttpTransport = new CalendarHttpTransport(calendarService);
  const calendarEntryHttpTransport = new CalendarEntryHttpTransport(calendarEntryService);

  app.register(fastifySwagger);

  const fastifyOpenapiGlueOptions: FastifyOpenapiGlueOptions = {
    specification: localFile('openapi.yaml'),
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
    // securityHandlers: new Security(),
    prefix: 'v1',
  };

  app.register(fastifySwaggerUi, {
    routePrefix: '/v1/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  app.register(fastifyOpenapiGlue, fastifyOpenapiGlueOptions);

  app.get('/', async function handler(request: FastifyRequest, reply: FastifyReply) {
    return { test: 'world' };
  });

  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    request.log.info({ error });
    reply.status(500).send({ error });
  });

  try {
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info({
      event: `Server listening on ${port} port!`,
    });

    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

export default buildServer;
