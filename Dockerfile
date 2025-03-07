FROM node:20-alpine AS base

WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
COPY src src
RUN yarn install --frozen-lockfile


COPY . .
RUN yarn build

FROM node:20-alpine AS production

WORKDIR /app
COPY --from=base /app/package.json ./
COPY --from=base /app/build ./build
COPY --from=base /app/node_modules ./node_modules

EXPOSE 3037

ENV NODE_ENV=production

CMD ["yarn", "start:prod"]