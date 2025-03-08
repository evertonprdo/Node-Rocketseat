# FastFeet API Challenge

![API Screenshot](screenshots/image.png)

This API is developed as part of the Node.js course challenge by Rocketseat. It is built using NestJS and follows Domain-Driven Design (DDD) principles. The system manages a delivery workflow with three types of users: **Admin, Deliverer**, and **Customer/Recipient.**

## Table of Contents

-  [Overview](#overview)

   -  [Application Rules](#application-rules)
   -  [Business Rules](#business-rules)

-  [Technologies Used](#technologies-used)
-  [Getting Started](#getting-started)

   -  [Prerequisites](#prerequisites)
   -  [Installation](#installation)

-  [Postman Collection](#postman-collection)
-  [Testing](#testing)
-  [Environment Variables](#environment-variables)

## Overview

The API supports the following features:

-  **Authentication**: Users log in using their CPF and password.
-  **User Management**: Register and manage users, with different roles (admin, deliverer, customer).
-  **Delivery Management**: Create, update, retrieve, and delete delivery orders (CRUD operations are restricted to admin users).
-  **Deliveries in the deliver's city**: List orders with delivery addresses in the deliverer’s operation city.
-  **Order Workflow**: Mark orders as available for pickup, withdraw them, deliver (with mandatory photo attachment), or mark as returned.
-  **Notifications**: Automatically notify recipients when the status of an order changes.
-  **Password Management**: Only an admin can change a user’s password.

### Application Rules

-  [x] The application must have two types of users: deliverer and/or admin.
-  [x] It must be possible to log in with CPF and password.
-  [x] It must be possible to perform CRUD operations on deliverers.
-  [x] It must be possible to perform CRUD operations on orders.
-  [x] It must be possible to perform CRUD operations on recipients.
-  [x] It must be possible to mark an order as awaiting pickup (Available for withdrawal).
-  [x] It must be possible to withdraw an order.
-  [x] It must be possible to mark an order as delivered.
-  [x] It must be possible to mark an order as returned.
-  [x] It must be possible to list orders with delivery addresses near the deliverer's location.
-  [x] It must be possible to change a user's password.
-  [x] It must be possible to list a user's deliveries.
-  [x] It must be possible to notify the recipient whenever the status of the order changes.

### Business Rules

-  [x] Only admin users can perform CRUD operations on orders.
-  [x] Only admin users can perform CRUD operations on deliverers.
-  [x] Only admin users can perform CRUD operations on recipients.
-  [x] To mark an order as delivered, it is mandatory to send a photo.
-  [x] Only the deliverer who withdrew the order can mark it as delivered.
-  [x] Only the admin can change a user's password.
-  [x] A deliverer cannot list another deliverer's orders.

## Technologies Used

The API is built using a modern tech stack that leverages the following technologies:

-  **Node.js & TypeScript**: Provides a solid and type-safe foundation for building scalable server-side applications.
-  **NestJS**: A progressive framework that helps organize the codebase with modules, controllers, and services, making it easier to maintain and scale.
-  **Prisma**: An ORM used for efficient database management and type-safe database queries.
-  **Cloudflare R2 Object Storage**: Utilized for file storage, allowing secure and reliable file uploads through an S3-compatible API.
-  **JWT & Passport**: Ensures secure authentication and authorization throughout the API.
-  **Zod**: Offers schema-based validation to ensure that incoming requests are correctly structured.
-  **Day.js**: Simplifies date manipulation and formatting.
-  **Bcryptjs**: Provides strong password hashing for secure user authentication.

## Getting Started

### Prerequisites

-  [Docker](https://www.docker.com/) installed on your machine.
-  Node.js and npm installed.
-  A basic understanding of RESTful APIs.

## Installation

1. **Navigate to the project directory:**

```bash
   cd 04-ddd-and-nestjs/challenge
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

**Prisma studio:** To see the database

```bash
   npx prisma studio
```

## Postman Collection

A Postman collection named `API.postman_colletion.json` is available in the root of the project. Import it into Postman to test the endpoints.

Note: The order in which HTTP requests are organized is such that if executed from top to bottom, all business rules are satisfied without the need for manual fixes.

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
