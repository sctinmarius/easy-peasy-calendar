import { FastifyReply, FastifyRequest } from 'fastify';
import { constants as HttpStatusCodes } from 'http2';

export class Security {
  private readonly USERNAME = process.env.BASIC_AUTH_USERNAME;
  private readonly PASSWORD = process.env.BASIC_AUTH_PASSWORD;
  async basicAuth(request: FastifyRequest, reply: FastifyReply) {
    const authorization = request.headers['authorization'];

    if (!authorization) {
      reply.code(HttpStatusCodes.HTTP_STATUS_UNAUTHORIZED).send({ error: 'Unauthorized' });
      return;
    }

    const [scheme, encoded] = authorization.split(' ');

    if (scheme !== 'Basic' || !encoded) {
      reply.code(HttpStatusCodes.HTTP_STATUS_UNAUTHORIZED).send({ error: 'Unauthorized' });
      return;
    }

    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    const [user, pass] = decoded.split(':');

    if (user === this.USERNAME && pass === this.PASSWORD) {
      return;
    } else {
      reply.code(HttpStatusCodes.HTTP_STATUS_UNAUTHORIZED).send({ error: 'Unauthorized' });
    }
  }
}
