# Easy Peasy Calendar

A simple calendar API built with Fastify and OpenAPI.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Starting the Server](#starting-the-server)
- [Running Tests](#running-tests)
- [Migration](#migration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Variables](#environment-variables)

## Installation

### Clone the repository:

    ```sh
    git clone git@github.com:sctinmarius/easy-peasy-calendar.git
    cd easy-peasy-calendar
    ```

### Install dependencies:

    ```sh
    yarn install
    ```

## Environment Variables

The following environment variables are required and should be defined in the `.env` and `.env.docker` files:

### .env
```
COMPOSE_PROFILES=dev
COMPOSE_PROJECT_NAME=easy_peasy_calendar

API_PORT=add_your_port

DATABASE_URL="postgresql://db_user:db_password@localhost:5432/database_name"
DATABASE_URL_TEST="postgresql://db_user:db_password@localhost:5432/database_name_test"

BASIC_AUTH_USERNAME="add_username"
BASIC_AUTH_PASSWORD="add_your_password"
```

### .env.docker
```
DATABASE_URL="postgresql://db_user:db_password@database:5432/database_name"
DATABASE_URL_TEST="postgresql://db_user:db_password@database:5432/database_name_test"
```

## Starting the Server

### Build containers `api` and `database`, and start the server using `yarn start:dev`
```sh
docker compose up -d
```

## Running Tests
### Run the tests in development mode, in the `api` container:

```sh
yarn test:dev
```

## Migration
### Generate a new migration when you update the schema.prisma
```sh
npx prisma migrate dev --name {migration-name}
```

### Apply migration to the test environment
```sh
cross-env DATABASE_URL=put_the_string_connection_from_DATABASE_URL_TEST npx prisma migrate deploy
```

## CI/CD Pipeline

The `ci.yaml` file defines the CI/CD pipeline for the project. Here is an overview of what happens in the `ci.yaml` file:

- **Install Dependencies**: Installs the required dependencies using `yarn install`.

- **Run Tests**: Runs the tests to ensure that the code is working as expected.

- **Build the Application**: Builds the application using `yarn build`.

- **Deploy the Application**: 
  - On the Pull Request branch, it will create a Docker image with the `test` tag.
  - After the changes are merged, it will create a Docker image with the `latest` tag.

