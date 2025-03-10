FROM node:20-alpine AS base

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --frozen-lockfile

COPY src src
COPY openapi openapi
COPY prisma ./prisma

RUN yarn prisma:generate
RUN yarn build

FROM node:20-alpine AS production

WORKDIR /app
COPY --from=base /app/package.json ./
COPY --from=base /app/build ./build
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/openapi ./openapi
COPY --from=base /app/prisma ./prisma

EXPOSE 3037

ENV NODE_ENV=production

RUN npx prisma migrate deploy

CMD ["yarn", "start:prod"]