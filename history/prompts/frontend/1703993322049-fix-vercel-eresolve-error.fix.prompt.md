---
id: 1703993322049
title: Fix Vercel ERESOLVE Error
stage: fix
feature: frontend
date: 2025-12-01
surface: agent
model: gemini-1.5-pro
branch: master
user: Haji
command: "resolve this error"
labels: ["vercel", "npm", "error", "dependencies"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - frontend/.npmrc
tests_yaml: []
---

### Problem

The user reported an `ERESOLVE` error during Vercel deployment, indicating a peer dependency conflict with `react-beautiful-dnd` and `react@19.2.0`. `react-beautiful-dnd@13.1.1` does not support React 19.

### Action Taken

After presenting options to the user, they opted for a quick fix. To resolve the peer dependency conflict during `npm install` on Vercel, a `.npmrc` file was created in the `frontend` directory with the content `legacy-peer-deps=true`. This instructs npm to proceed with the installation despite peer dependency warnings, which should allow the Vercel build to complete successfully.

### Outcome

The `.npmrc` file was created, which should enable the Vercel deployment to bypass the `ERESOLVE` error.