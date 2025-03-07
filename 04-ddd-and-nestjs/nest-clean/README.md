# Forum API - NestJS with DDD principles

![API Screenshot](screenshots/image.png)

## Table of Contents

-  [Technologies Used](#technologies-used)
-  [Getting Started](#getting-started)

   -  [Prerequisites](#prerequisites)
   -  [Installation](#installation)

-  [Postman Collection](#postman-collection)
-  [Testing](#testing)
-  [Environment Variables](#environment-variables)

## Technologies Used

-  [NestJS](https://nestjs.com/)
-  [Zod](https://zod.dev/)
-  [Prisma](https://www.prisma.io/)
-  [Vitest](https://vitest.dev/)

## Getting Started

### Prerequisites

-  [Docker](https://www.docker.com/) installed on your machine.
-  Node.js and npm installed.
-  A basic understanding of RESTful APIs.

## Installation

1. **Navigate to the project directory:**

```bash
   cd 04-ddd-and-nestjs/nest-clean
```

2. **Start Docker services:**

```bash
   docker-compose up
```

3. **Run Prisma migrations:**

```bash
   npx prisma migrate dev
```

4. **Seed the database:** First check if this has not already been done automatically with `npx prisma migrate dev`

```bash
   npx prisma db seed
```

5. **Start the development server:**

```bash
   npm run start:dev
```

## Postman Collection

A Postman collection named `API.postman_colletion.json` is available in the root of the project. Import it into Postman to test the endpoints.

Node: The order in which HTTP requests are organized is such that if executed from top to bottom, all business rules are satisfied without the need for manual fixes.

## Testing

The project uses Vitest for testing. To run the tests, execute:

```bash
   npm run test
   npm run test:e2e
```

Note: To run the E2E tests, you will need to have docker running `docker-compose up` if it is not already done.

## Environment Variables

Create a `.env` file in the root of the project with the following variables (example):

```env
   # Prisma
   DATABASE_URL="postgresql://postgres:docker@localhost:5432/mydb?schema=public"

   # Uploads (AWS / Cloudflare)
   # To complete the information below, you'll need R2 object storage on Cloudflare. Visit https://developers.cloudflare.com/r2/ for more information.
   CLOUDFLARE_ACCOUNT_ID=

   AWS_BUCKET_NAME=
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=

   # Auth (JWT)
   # Sample keys provided for convenience, do not use in your projects
   JWT_PUBLIC_KEY=
   JWT_PRIVATE_KEY=
```

Ensure these variables are set to match your environment.
