import { FastifyRequest } from 'fastify';
import buildServer from './server';

const logger = {
  redact: ['req.headers.authorization', 'req.headers.cookie'],
  level: 'info',
  serializers: {
    req(request: FastifyRequest) {
      return {
        method: request.method,
        url: request.url,
        headers: request.headers,
        hostname: request.hostname,
        remoteAddress: request.ip,
        remotePort: request.socket.remotePort,
      };
    },
  },
};

buildServer({ port: Number(process.env.API_PORT), logger });
