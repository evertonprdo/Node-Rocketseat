# Gym API - Node.js with SOLID Principles

![API Screenshot](screenshots/image.png)

This project is an API for a gym management system built with Node.js following the SOLID principles. It was developed as part of Rocketseat's Node.js classes. The API handles user registration, authentication, gym search, check-ins, and more.

## Table of Contents

-  [Features](#features)
-  [Requirements](#requirements)

   -  [Functional Requirements](#functional-requirements)
   -  [Business Rules](#business-rules)
   -  [Non-Functional Requirements](#non-functional-requirements)

-  [Technologies Used](#technologies-used)
-  [Getting Started](#getting-started)

   -  [Prerequisites](#prerequisites)
   -  [Installation](#installation)

-  [Postman Collection](#postman-collection)
-  [Testing](#testing)
-  [Environment Variables](#environment-variables)

## Features

-  **User Registration & Authentication**: Users can sign up and log in.
-  **Profile & Check-In History**: Authenticated users can view their profile, check-in count, and history.
-  **Gym Search**: Users can search for gyms nearby (within a 10km radius) or by name.
-  **Check-In System**: Users can perform check-ins at a gym, and administrators can validate them.
-  **Administrator Actions**: Only administrators can register new gyms and validate user check-ins.

## Requirements

### Functional Requirements

-  [x] Users can register.
-  [x] Users can authenticate.
-  [x] Logged-in users can retrieve their profile.
-  [x] Logged-in users can see the number of check-ins they have made.
-  [x] Users can view their check-in history.
-  [x] Users can search for nearby gyms (up to 10km).
-  [x] Users can search gyms by name.
-  [x] Users can check in at a gym.
-  [x] Check-ins can be validated by an administrator.
-  [x] Gyms can be registered by administrators.

### Business Rules

-  [x] A user cannot register with a duplicate email.
-  [x] A user cannot check in more than once on the same day.
-  [x] A user cannot check in if not within 100 meters of the gym.
-  [x] A check-in can only be validated within 20 minutes after creation.
-  [x] Only administrators can validate check-ins.
-  [x] Only administrators can register gyms.

### Non-Functional Requirements

-  [x] User passwords are encrypted.
-  [x] Data is persisted in a PostgreSQL database.
-  [x] All data listings are paginated with 20 items per page.
-  [x] Users are identified by a JWT (JSON Web Token).

## Technologies Used

-  ![Fastify](https://www.fastify.io/)
-  ![fastify/jwt](https://github.com/fastify/fastify-jwt)
-  ![fastify/cookie](https://github.com/fastify/fastify-cookie)
-  ![Zod](https://zod.dev/)
-  ![Prisma](https://www.prisma.io/)
-  ![Vitest](https://vitest.dev/)

## Getting Started

### Prerequisites

-  ![Docker](https://www.docker.com/) installed on your machine.
-  Node.js and npm installed.
-  A basic understanding of RESTful APIs.

## Installation

1. **Navigate to the project directory:**

```bash
   cd 03-implementing-solid/apiNodeSOLID
```

2. **Start Docker services:**

```bash
   docker-compose up
```

3. **Run Prisma migrations:**

```bash
   npx prisma migrate dev
```

4. **Seed the database:**

```bash
   npx prisma db seed
```

5. **Start the development server:**

```bash
   npm run start:dev
```

## Postman Collection

A Postman collection named `API.postman_colletion.json` is available in the root of the project. Import it into Postman to test the endpoints. The collection includes requests for:

-  User registration
-  Sessions for admin and member
-  Token refresh
-  Fetching the user profile (User Me)
-  Gym creation, search, and nearby search
-  Check-in and validation workflows
-  Check-in history and metrics

Node: The order in which HTTP requests are organized is such that if executed from top to bottom, all business rules are satisfied without the need for manual fixes. (JTW expires in 10 min)

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
   JWT_SECRET=your_jwt_secret
   DATABASE_URL="postgresql://docker:docker@localhost:5432/apisolid?schema=public"
```

Ensure these variables are set to match your environment.
