# Tasks / Atomic Work Units: Advanced To-Do App

This document outlines the granular, dependency-ordered tasks required to implement the Advanced To-Do App feature, derived from the specification and implementation plan.

## Implementation Strategy

The implementation will follow an MVP-first approach, focusing on delivering core Task CRUD, Filtering, and Priority functionalities with Local Storage persistence and Backend Integration. Optional enhancements will be addressed incrementally after the core features are stable and validated.

## Dependency Graph (User Story Completion Order)

1.  **US1: Task CRUD** (Core task management)
2.  **US2: Filters** (Depends on existing tasks)
3.  **US3: Task Priority** (Depends on existing tasks)
4.  **US4: Local Storage & Offline** (Integrates with task management)
5.  **US5: Backend Integration** (Integrates with task management and Local Storage)
6.  **US6: Optional Enhancements** (Builds on core features)

## Parallel Execution Examples

Tasks marked with `[P]` can potentially be executed in parallel. For example:
*   Frontend UI tasks for different user stories, once foundational components are ready.
*   Backend API route implementations, once data models are stable.
*   Testing tasks for a user story can begin as soon as the implementation tasks for that story are underway.

---

## Phase 1: Setup

Goal: Initialize the project, configure development tools, and establish the basic project structure.

- [x] T001 Create Next.js project with TypeScript, `npm init next-app . --ts`
- [x] T002 Configure ESLint for linting and Prettier for code formatting.
- [x] T003 Set up Jest and React Testing Library for testing.
- [x] T004 Define and implement initial folder structure as per `plan.md` (e.g., `frontend/src/components`, `backend/src/api`).
- [x] T005 Configure Vercel deployment for CI/CD setup (initial `.github/workflows/main.yml` or similar).
- [x] T006 Implement basic performance monitoring/logging setup (e.g., simple console logs for operation duration).

---

## Phase 2: Foundational Components & Utilities

Goal: Establish reusable components, hooks, and utilities that will be used across multiple user stories.

- [x] T007 Create UUID generation utility `frontend/src/utils/uuid.ts` or `backend/src/utils/uuid.ts` (depending on where tasks are initially generated).
- [x] T008 Define core `Task` TypeScript interfaces/types in `frontend/src/types/task.ts` and `backend/src/types/task.ts`.
- [ ] T009 Implement a generic API client utility `frontend/src/services/api-client.ts` to interact with backend routes.
- [ ] T010 Implement a LocalStorage utility `frontend/src/utils/localStorage.ts` for task persistence.

---

## Phase 3: User Story 1: Task CRUD

Goal: Implement the core Create, Read, Update, and Delete functionality for tasks, including inline editing.

### Independent Test Criteria

-   Users can create new tasks with title and priority.
-   All created tasks are displayed in a list.
-   Existing tasks can be edited inline (title, priority) with save/cancel.
-   Tasks can be deleted from the list.
-   Basic input validation (e.g., title length) is enforced.

### Tasks

- [x] T011 [US1] Create `TaskForm` component for adding new tasks in `frontend/src/components/TaskForm.tsx`.
- [x] T012 [P] [US1] Create `TaskItem` component for displaying a single task and inline editing in `frontend/src/components/TaskItem.tsx`.
- [x] T013 [P] [US1] Create `TaskList` component to render all tasks using `TaskItem`s in `frontend/src/components/TaskList.tsx`.
- [x] T014 [US1] Implement basic state management for tasks (e.g., using `useState` or `useReducer`) within `frontend/src/pages/index.tsx` or a dedicated context.
- [x] T015 [US1] Integrate `TaskForm` and `TaskList` into the main application page `frontend/src/pages/index.tsx`.
- [x] T016 [US1] Implement client-side validation for task title (1-100 characters, not empty) in `frontend/src/components/TaskForm.tsx`.
- [x] T017 [US1] Add Jest unit tests for `TaskForm`, `TaskItem`, and `TaskList` components in `frontend/src/components/__tests__/TaskForm.test.tsx`, etc.
- [x] T018 [US1] Add integration tests for CRUD operations on the UI using React Testing Library.

---

## Phase 4: User Story 2: Filters

Goal: Enable users to filter tasks by status (All, Completed, Pending) and priority (Low, Medium, High).

### Independent Test Criteria

-   Users can select filters for status and priority.
-   Filters can be combined (e.g., show only 'Pending' and 'High' priority tasks).
-   The task list updates correctly based on selected filters.
-   Default view shows all tasks, sorted by creation date.

### Tasks

- [x] T019 [P] [US2] Create `FilterControls` component with status and priority selection in `frontend/src/components/FilterControls.tsx`.
- [ ] T020 [US2] Implement filtering logic within the state management layer of `frontend/src/pages/index.tsx` (or context).
- [x] T021 [US2] Integrate `FilterControls` with `TaskList` to apply filters.
- [ ] T022 [US2] Implement default sorting by `createdAt` (newest first).
- [x] T023 [US2] Add Jest unit tests for `FilterControls` component and filtering logic.

---

## Phase 5: User Story 3: Task Priority

Goal: Visually indicate task priority and allow sorting by priority.

### Independent Test Criteria

-   Tasks display visual indicators (colors/badges) corresponding to their priority (Low=Green, Medium=Yellow, High=Red).
-   Optional: Tasks can be sorted by priority.

### Tasks

- [ ] T024 [US3] Enhance `TaskItem` component to display color-coded priority badges based on `priority` prop in `frontend/src/components/TaskItem.tsx`.
- [ ] T025 [P] [US3] (Optional) Add a sort control for priority in `frontend/src/components/FilterControls.tsx`.
- [ ] T026 [US3] Add Jest unit tests for priority display and optional sorting logic.

---

## Phase 6: User Story 4: Local Storage & Offline Handling

Goal: Ensure task persistence across browser reloads and provide a robust offline experience with conflict resolution.

### Independent Test Criteria

-   Tasks persist in LocalStorage and are reloaded on page refresh.
-   An offline notification is displayed when the application detects a loss of backend connectivity.
-   API calls are queued during offline periods and automatically synced when connectivity is restored.
-   Conflict resolution (last-write-wins) handles discrepancies between local and backend data, with user notification if local changes are overwritten.

### Tasks

- [ ] T027 [US4] Modify task state management to sync with `LocalStorage` using the `frontend/src/utils/localStorage.ts` utility.
- [ ] T028 [US4] Implement network status detection and display an offline notification banner in `frontend/src/components/OfflineBanner.tsx`.
- [ ] T029 [US4] Develop a queueing mechanism for API calls in `frontend/src/services/api-client.ts` to store requests during offline periods.
- [x] T030 [US4] Implement logic to process the API call queue and sync with the backend when online.
- [ ] T031 [US4] Implement conflict resolution strategy (last-write-wins) for tasks, including user notification for overwrites.
- [ ] T032 [US4] Add integration tests for LocalStorage persistence, offline behavior, queuing, and conflict resolution.

---

## Phase 7: User Story 5: Backend Integration

Goal: Implement Next.js API routes for task CRUD operations and integrate frontend with these routes.

### Independent Test Criteria

-   Frontend CRUD operations successfully interact with the backend API.
-   Backend API routes (`GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`) are functional.
-   Server-side validation for tasks is enforced by the API.
-   API returns appropriate HTTP status codes (200, 201, 400, 404, 500).
-   Rate-limiting (10 requests/sec per IP) is enforced on API routes.

### Tasks

- [ ] T033 [P] [US5] Implement `GET /tasks` API route in `backend/src/api/tasks/route.ts` (Next.js App Router API route or similar).
- [ ] T034 [P] [US5] Implement `POST /tasks` API route in `backend/src/api/tasks/route.ts`.
- [ ] T035 [P] [US5] Implement `PUT /tasks/{id}` API route in `backend/src/api/tasks/[id]/route.ts`.
- [ ] T036 [P] [US5] Implement `DELETE /tasks/{id}` API route in `backend/src/api/tasks/[id]/route.ts`.
- [ ] T037 [US5] Implement server-side validation for task data in `backend/src/utils/validation.ts`.
- [ ] T038 [US5] Configure rate-limiting for API routes (e.g., using a middleware or a library).
- [ ] T039 [US5] Modify `frontend/src/services/api-client.ts` to use the new backend API routes for all CRUD operations.
- [ ] T040 [US5] Add integration tests for all API routes (backend) and full-stack integration tests for frontend-to-backend communication.

---

## Phase 8: User Story 6: Optional Enhancements

Goal: Implement optional, non-critical features that enhance user experience. These can be prioritized separately.

### Independent Test Criteria (for each sub-feature)

-   **Drag-and-drop**: Tasks can be reordered via drag-and-drop, and the order persists.
-   **Undo**: The last add, delete, or edit action can be undone once.
-   **Notifications**: Toast/snackbar notifications appear for completed tasks.

### Tasks

- [ ] T041 [P] [US6] Implement drag-and-drop reordering for `TaskItem`s within `TaskList` in `frontend/src/components/TaskList.tsx`.
- [ ] T042 [US6] Ensure drag-and-drop reordering persists to LocalStorage and Backend API.
- [ ] T043 [P] [US6] Implement an undo mechanism for the last task add, delete, or edit action.
- [ ] T044 [P] [US6] Create and integrate a notification (toast/snackbar) system for task completion in `frontend/src/components/Notification.tsx`.
- [ ] T045 [US6] Add unit/integration tests for optional enhancements.

---

## Phase 9: Polish & Cross-Cutting Concerns

Goal: Address cross-cutting concerns like accessibility, performance, comprehensive testing, documentation, and deployment readiness.

### Independent Test Criteria

-   All interactive elements are keyboard navigable.
-   ARIA labels are present and correct.
-   Color contrast meets accessibility standards (≥ 4.5:1).
-   Application performs efficiently (<100ms operations).
-   Codebase is well-documented and follows conventions.
-   All core functionality has ≥80% test coverage.
-   App successfully deploys to Vercel via CI/CD.

### Tasks

- [ ] T046 Perform accessibility audit and implement fixes (keyboard navigation, ARIA, color contrast) across `frontend/src/components/` and `frontend/src/pages/`.
- [ ] T047 Implement performance optimizations (memoization, lazy loading, list virtualization if needed) in `frontend/src/components/`.
- [ ] T048 Write comprehensive unit and integration tests to achieve ≥80% coverage for core functionality.
- [ ] T049 Create/update `README.md` with project overview, setup, features, and deployment instructions.
- [ ] T050 Generate/update API documentation (`docs/api.md` or similar) for backend endpoints.
- [ ] T051 Ensure all components, functions, and hooks have appropriate inline comments.
- [ ] T052 Finalize Vercel deployment configuration and CI/CD pipeline (`.github/workflows/main.yml`).
- [ ] T053 Conduct final end-to-end testing and performance profiling before release.

---

## Final Report

**Total Task Count**: 53
**Task Count per User Story**:
*   Setup: 6
*   Foundational: 4
*   US1: Task CRUD: 8
*   US2: Filters: 5
*   US3: Task Priority: 3
*   US4: Local Storage & Offline: 6
*   US5: Backend Integration: 8
*   US6: Optional Enhancements: 5
*   Polish & Cross-Cutting Concerns: 8

**Parallel Opportunities Identified**: Many tasks within User Story phases, especially UI component development and API route implementations, are marked `[P]` indicating they can be parallelized.

**Independent Test Criteria for each story**: Defined within each User Story section.

**Suggested MVP Scope**:
Phase 1: Setup
Phase 2: Foundational Components & Utilities
Phase 3: User Story 1: Task CRUD
Phase 4: User Story 2: Filters
Phase 5: User Story 3: Task Priority
Phase 6: User Story 4: Local Storage & Offline
Phase 7: User Story 5: Backend Integration

This MVP provides a fully functional, persistent, and synchronized To-Do application.

**Format Validation**: All tasks follow the checklist format `- [ ] TXXX [P?] [USX?] Description with file path`.
