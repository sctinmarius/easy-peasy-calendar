import { FastifyInstance } from 'fastify';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export default async function ajvPlugin(app: FastifyInstance) {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  app.setValidatorCompiler(({ schema }) => {
    return ajv.compile(schema);
  });
}
