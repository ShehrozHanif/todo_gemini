---
id: 1703993322051
title: Fix TaskList DnD Import
stage: fix
feature: frontend
date: 2025-12-01
surface: agent
model: gemini-1.5-pro
branch: 1-todo-app-advanced
user: Haji
command: "now this error occur while deploy on vercel"
labels: ["vercel", "npm", "error", "frontend", "import"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - frontend/src/components/TaskList.tsx
tests_yaml: []
---

### Problem

The user reported a "Module not found: Can't resolve 'react-beautiful-dnd'" error during Vercel deployment, despite `@hello-pangea/dnd` being correctly added to `package.json` in a previous step. This indicated that the `frontend/src/components/TaskList.tsx` file was still importing from the deprecated `react-beautiful-dnd` library.

### Action Taken

1.  `frontend/src/components/TaskList.tsx` was inspected, confirming that line 5 was importing from `react-beautiful-dnd`.
2.  The import statement in `frontend/src/components/TaskList.tsx` was modified to import `DragDropContext`, `Droppable`, `Draggable`, and `DropResult` from `@hello-pangea/dnd`.
3.  The changes were committed with the message "fix(frontend): Update TaskList to import from @hello-pangea/dnd" and pushed to GitHub.

### Outcome

The `frontend/src/components/TaskList.tsx` file now correctly imports the drag-and-drop components from `@hello-pangea/dnd`, which is installed as a dependency. This should resolve the "Module not found" error during the Vercel build process related to the import statement.