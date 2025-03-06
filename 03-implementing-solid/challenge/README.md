# Pets API - Node.js with SOLID Principles

![API Screenshot](screenshots/image.png)

This project is an API for a org's pet management system built with Node.js following the SOLID principles. It was developed as part of Rocketseat's Node.js challenge. The API handles orgs registration, authentication, orgs nearby, pets search, and more.

## Table of Contents

-  [Features](#features)
-  [Requirements](#requirements)

   -  [Functional Requirements](#functional-requirements)
   -  [Business Rules](#business-rules)

-  [Technologies Used](#technologies-used)
-  [Getting Started](#getting-started)

   -  [Prerequisites](#prerequisites)
   -  [Installation](#installation)

-  [Postman Collection](#postman-collection)
-  [Testing](#testing)
-  [Environment Variables](#environment-variables)

## Features

-  **Org Registration & Authentication**: Orgs can sign up and log in.
-  **Pets registration**: Authenticated orgs can register pets.
-  **Orgs Search**: Users can search for nearby orgs (within a 10km radius).
-  **Pets Search**: Users can search for pets for adoption.

## Requirements

### Functional Requirements

- [x] It must be possible to register a pet
- [x] It must be possible to list all pets available for adoption in a city
- [x] It must be possible to filter pets by their characteristics
- [x] It must be possible to view details of a pet for adoption
- [x] It must be possible to register as an ORG
- [x] It must be possible to log in as an ORG
- [x] It must be possible to fetch for nearby orgs

### Business Rules

- [x] To list pets, it is mandatory to provide the city
- [x] An ORG must have an address and a WhatsApp number
- [x] A pet must be linked to an ORG
- [x] The user who wants to adopt will contact the ORG via WhatsApp
- [x] All filters, besides the city, are optional
- [x] For an ORG to access the application as an admin, it needs to be logged in

## Technologies Used

-  [Fastify](https://www.fastify.io/)
-  [fastify/jwt](https://github.com/fastify/fastify-jwt)
-  [fastify/cookie](https://github.com/fastify/fastify-cookie)
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
   cd 03-implementing-solid/challenge
```

2. **Start Docker services:**

```bash
   docker-compose up
```

3. **Run Prisma migrations:**

```bash
   npx prisma migrate dev
```

4. **Start the development server:**

```bash
   npm run start:dev
```

## Postman Collection

A Postman collection named `API.postman_colletion.json` is available in the root of the project. Import it into Postman to test the endpoints.

Node: The order in which HTTP requests are organized is such that if executed from top to bottom, all business rules are satisfied without the need for manual fixes. (JTW expires in 12 min)

## Testing

The project uses Vitest for testing. To run the tests, execute:

```bash
   npm run test
   npm run test:e2e
```

## Environment Variables

Create a `.env` file in the root of the project with the following variables (example):

```env
   NODE_ENV=dev
   PORT=3333
   JWT_SECRET=any-amount-of-characters
   DATABASE_URL="postgresql://docker:docker@localhost:5432/mydb?schema=public"
```

Ensure these variables are set to match your environment.