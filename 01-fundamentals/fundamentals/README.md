# Fundamentals - Users API

[!API Screenshot](screenshots/image.png)

## Overview

The Users API provides endpoints to manage users—allowing you to search, list, create, update, and delete user records. This API was built using pure Node.js, without any external libraries, as part of an educational project focused on understanding the fundamentals of Node.js.

By building the API with only Node.js core modules, the project demonstrates the inner workings of Node.js, such as handling HTTP requests, routing, and processing JSON data without relying on frameworks or third-party libraries

## Endpoints

-  GET `/users`
-  GET `/users?search={email/name}`
-  POST `/users`
-  PUT `/users/{:id}`
-  DELETE `/users/{:id}`

Sample: Import the `Users.postman_colletion.json` file into Postman

## Running Server

To start the server on port 3333 `npm run dev`
