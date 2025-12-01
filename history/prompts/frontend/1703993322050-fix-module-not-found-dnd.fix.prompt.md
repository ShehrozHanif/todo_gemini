---
id: 1703993322050
title: Fix Module Not Found @hello-pangea/dnd
stage: fix
feature: frontend
date: 2025-12-01
surface: agent
model: gemini-1.5-pro
branch: 1-todo-app-advanced
user: Haji
command: "now this error occur while deploy on vercel"
labels: ["vercel", "npm", "error", "dependencies", "frontend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - frontend/package.json
  - frontend/package-lock.json
tests_yaml: []
---

### Problem

The user reported a "Module not found: Can't resolve '@hello-pangea/dnd'" error during Vercel deployment, occurring after `npm install` completed successfully. This indicated that the code was updated to use `@hello-pangea/dnd`, but the dependency was not correctly added to `frontend/package.json` or an incorrect version was specified.

### Action Taken

1. Initially, an attempt was made to add `@hello-pangea/dnd` with an assumed version `^1.1.0`. This failed due to no matching version found.
2. The available versions for `@hello-pangea/dnd` were fetched using `npm view @hello-pangea/dnd versions`. The latest stable version was identified as `18.0.1`.
3. `frontend/package.json` was updated to replace `react-beautiful-dnd` with `@hello-pangea/dnd` and its correct version `^18.0.1`.
4. `npm install` was run in the `frontend` directory to install the new dependency and update `frontend/package-lock.json`.
5. The changes were committed with the message "fix(frontend): Replace react-beautiful-dnd with @hello-pangea/dnd" and pushed to GitHub.

### Outcome

The `@hello-pangea/dnd` package has been successfully installed and its dependency recorded in `frontend/package.json` and `frontend/package-lock.json`. This should resolve the "Module not found" error during the Vercel build process.