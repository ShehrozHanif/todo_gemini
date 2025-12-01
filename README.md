# Advanced To-Do App

This is an Advanced To-Do Application built with Next.js, TypeScript, and Tailwind CSS. It provides comprehensive task management features, including CRUD operations, filtering, sorting, local persistence, offline handling, and a backend API.

## Features

-   **Task Management**: Create, Read, Update, and Delete tasks.
-   **Inline Editing**: Edit task titles and priorities directly in the list.
-   **Priority Levels**: Tasks can be assigned Low, Medium, or High priority.
-   **Filtering**: Filter tasks by status (All, Completed, Pending) and priority (All, Low, Medium, High).
-   **Sorting**: Sort tasks by creation date (newest first) or priority.
-   **Local Persistence**: Tasks are saved to LocalStorage, preserving data across browser sessions.
-   **Offline Handling**: Detects offline status, queues API requests, and syncs automatically when online (basic last-write-wins conflict resolution).
-   **Backend API**: RESTful API endpoints for managing tasks (in-memory for now).
-   **Notifications**: Toast notifications for user actions (add, update, delete, reorder).
-   **Drag-and-Drop Reordering**: Reorder tasks in the list using drag-and-drop.
-   **Accessibility**: Basic accessibility considerations for interactive elements.
-   **Performance**: Basic optimizations like `useMemo` for filtered/sorted lists.

## Project Structure

The project is structured into `frontend` and `backend` directories:

-   `frontend/`: Contains the Next.js application (UI components, pages, services).
-   `backend/`: Contains the Next.js API routes logic (models, services, API routes, middleware).

## Setup & Local Development

### Prerequisites

-   Node.js (v20 or higher)
-   npm (included with Node.js)
-   Git

### 1. Clone the Repository

```bash
git clone https://github.com/ShehrozHanif/todo_gemini.git
cd todo_gemini
# Ensure you are on the correct branch if applicable
# git checkout main
```

### 2. Install Dependencies

Navigate to the `frontend` directory and install dependencies:

```bash
cd frontend
npm install
```

### 3. Run the Development Server

From the `frontend` directory:

```bash
npm run dev
```

This will start the development server on `http://localhost:3000`.

### 4. Build for Production

From the `frontend` directory:

```bash
npm run build
```

This command builds the Next.js application for production.

### 5. Start Production Server

From the `frontend` directory, after building:

```bash
npm start
```

This will start the production server.

## Testing

From the `frontend` directory, to run the tests:

```bash
npm test
```

## Deployment

The application is configured for deployment on Vercel. Ensure you have the following secrets configured in your Vercel project:

-   `VERCEL_TOKEN`
-   `VERCEL_PROJECT_ID`
-   `VERCEL_ORG_ID`
-   `VERCEL_SCOPE`

A GitHub Actions workflow (`frontend/.github/workflows/main.yml`) is set up to automatically deploy changes from the `main` branch to Vercel.
