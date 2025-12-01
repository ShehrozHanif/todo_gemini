# Advanced To-Do App API Documentation

This document provides an overview of the RESTful API endpoints for the Advanced To-Do Application. The API follows OpenAPI Specification 3.0.0.

## OpenAPI Specification

The full API specification is available in the `tasks-api.yaml` file located at `specs/1-todo-app-advanced/contracts/tasks-api.yaml`. This YAML file can be used with OpenAPI tools (like Swagger UI, Postman, etc.) to generate interactive documentation, client SDKs, or server stubs.

## Endpoints

Below is a high-level summary of the available endpoints. For detailed request/response schemas, refer to the `tasks-api.yaml`.

### Tasks

Manages individual To-Do tasks.

-   **GET `/api/tasks`**
    -   **Description**: Retrieves a list of all tasks.
    -   **Responses**:
        -   `200 OK`: Returns an array of Task objects.
        -   `500 Internal Server Error`

-   **POST `/api/tasks`**
    -   **Description**: Creates a new task.
    -   **Request Body**: `NewTask` object (title, priority).
    -   **Responses**:
        -   `201 Created`: Returns the newly created Task object.
        -   `400 Bad Request`: Invalid input (e.g., missing title, invalid priority).
        -   `500 Internal Server Error`

-   **GET `/api/tasks/{id}`**
    -   **Description**: Retrieves a specific task by its ID.
    -   **Path Parameters**:
        -   `id` (string, UUID): The unique identifier of the task.
    -   **Responses**:
        -   `200 OK`: Returns the requested Task object.
        -   `404 Not Found`: Task with the specified ID does not exist.
        -   `500 Internal Server Error`

-   **PUT `/api/tasks/{id}`**
    -   **Description**: Updates an existing task by its ID.
    -   **Path Parameters**:
        -   `id` (string, UUID): The unique identifier of the task.
    -   **Request Body**: `UpdateTask` object (partial Task fields: title, completed, priority).
    -   **Responses**:
        -   `200 OK`: Returns the updated Task object.
        -   `400 Bad Request`: Invalid input.
        -   `404 Not Found`: Task with the specified ID does not exist.
        -   `500 Internal Server Error`

-   **DELETE `/api/tasks/{id}`**
    -   **Description**: Deletes a specific task by its ID.
    -   **Path Parameters**:
        -   `id` (string, UUID): The unique identifier of the task.
    -   **Responses**:
        -   `200 OK`: Task deleted successfully.
        -   `404 Not Found`: Task with the specified ID does not exist.
        -   `500 Internal Server Error`

## Data Models

Refer to `tasks-api.yaml` for full definitions, but key models include:

-   **Task**: Full representation of a task with `id`, `title`, `completed`, `priority`, `createdAt`, `updatedAt`.
-   **NewTask**: Fields required to create a new task (e.g., `title`, `priority`).
-   **UpdateTask**: Fields that can be updated for an existing task (e.g., `title`, `completed`, `priority`).
