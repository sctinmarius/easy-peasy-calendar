# easy-peasy-calendar

Calendar API

## Start services (Docker)
### run docker command
`docker compose up -d`
### run the tests 
`yarn test:dev`

## Migration
### generate a new migration when you update the schema.prisma 
`npx prisma migrate dev --name {migration-name}`

### apply migration to test environment
`cross-env DATABASE_URL=put_the_string_connection_from_DATABASE_URL_TEST npx prisma migrate deploy`