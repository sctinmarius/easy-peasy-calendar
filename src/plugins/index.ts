import { FastifyInstance } from 'fastify';
import swaggerPlugin from './swagger';
import swaggerUiPlugin from './swagger-ui';
import openapiGluePlugin from './openapi-glue';
import ajvPlugin from './ajv';

export default async function registerPlugins(app: FastifyInstance) {
  await ajvPlugin(app);
  await swaggerPlugin(app);
  await swaggerUiPlugin(app);
  await openapiGluePlugin(app);
}
