# Fundamentals - Tasks API

[!API Screenshot](screenshots/image.png)

## Overview

The Tasks API provides endpoints to manage tasks—allowing you to search, list, create, update, and delete tasks records. This API was built using pure Node.js, without any external libraries, as part of an educational challenge project focused on understanding the fundamentals of Node.js.

By building the API with only Node.js core modules, the project demonstrates the inner workings of Node.js, such as handling HTTP requests, routing, and processing JSON data without relying on frameworks or third-party libraries

## Endpoints

-  GET `/tasks`
-  GET `/tasks?search={title}`
-  POST `/tasks`
-  POST `/tasks/csv`
-  PUT `/tasks/{:id}`
-  DELETE `/tasks/{:id}`

Sample: Import the `Tasks.postman_colletion.json` file into Postman

## Running Server

To start the server on port 3333 `npm run dev`

## Challenge Description

In this challenge, you will develop an API to perform CRUD operations on your tasks.

The API must include the following functionalities:

-  [x] Create a task
-  [x] List all tasks
-  [x] Update a task by `id`
-  [x] Remove a task by `id`
-  [x] Mark a task as complete by `id`
-  [x] And the real challenge: Bulk import tasks from a CSV file

### Routes and Business Rules

Before defining the routes, let's understand the structure (properties) that a task should have:

-  [x] `id` - Unique identifier for each task
-  [x] `title` - Task title
-  [x] `description` - Detailed description of the task
-  [x] `completed_at` - Date when the task was completed. The initial value must be null
-  [x] `created_at` - Date when the task was created
-  [x] `updated_at` - Must always be updated to the date when the task was modified

### Routes

-  [x] `POST - /tasks`
       It should be possible to create a task in the database by sending the title and description fields in the request body.
       When creating a task, the following fields must be automatically populated according to the property guidelines above: id, created_at, updated_at, and completed_at.

-  [x] `GET - /tasks`
       It should be possible to list all tasks saved in the database.
       It should also be possible to perform a search, filtering tasks by title and description.

-  [x] `PUT - /tasks/:id`
       It should be possible to update a task by id.
       The request body should contain only title and/or description fields to be updated.
       If only title is sent, then description must not be updated, and vice versa.
       Before updating, a validation should be performed to check if the id belongs to a task saved in the database.

-  [x] `DELETE - /tasks/:id`
       It should be possible to remove a task by id.
       Before deletion, a validation should be performed to check if the id belongs to a task saved in the database.

-  [x] `PATCH - /tasks/:id/complete`
       It should be possible to mark a task as complete or incomplete. This means that if the task is completed, it should return to its "normal" state.
       Before updating, a validation should be performed to check if the id belongs to a task saved in the database.
