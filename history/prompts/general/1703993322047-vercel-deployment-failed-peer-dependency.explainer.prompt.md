---
phr_id: 1703993322047-vercel-deployment-failed-peer-dependency
title: Vercel deployment failed due to peer dependency conflict
stage: explainer
date: 2025-12-01
surface: agent
model: gemini-1.5-flash
feature: 1-todo-app-advanced
branch: 1-todo-app-advanced
user: User
command: deploy this project on vercel (frontend option A selected, deployment failed)
labels:
  - vercel
  - deployment
  - npm
  - peer-dependency
  - react
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: []
tests_yaml: []
prompt_text: |
  deploy this project on vercel (after user selected option A to deploy frontend)
response_text: |
  The Vercel deployment failed because `react-beautiful-dnd` (a dependency in your `frontend` project) is not compatible with `React 19.2.0` (the version of React you are using).

  To temporarily resolve this and proceed with the deployment, you can instruct Vercel to install dependencies using the `--legacy-peer-deps` flag. This flag tells npm to ignore peer dependency conflicts, allowing the installation to complete.

  **Steps to deploy:**

  1.  **Go to your Vercel project dashboard:** Log in to Vercel and navigate to the project corresponding to your `frontend` application.
  2.  **Access Project Settings:** Go to "Settings" for that project.
  3.  **Navigate to "Build & Development Settings":** Under the "General" tab, find the "Build & Development Settings" section.
  4.  **Override "Install Command":** Change the "Install Command" to:
      ```
      npm install --legacy-peer-deps
      ```
  5.  **Save Changes:** Save the updated settings.
  6.  **Trigger a new deployment:** Initiate a new deployment from your Git repository.

  **Important Note:** Using `--legacy-peer-deps` is a temporary workaround. `react-beautiful-dnd` is no longer actively maintained and does not officially support React 19. For a long-term solution, it is highly recommended to migrate to a different drag-and-drop library like `dnd-kit` or `react-dnd` that is actively maintained and compatible with modern React versions.
outcome: |
  The Vercel deployment of the frontend failed due to a peer dependency conflict between `react-beautiful-dnd` and `React 19`. The agent explained the issue to the user and provided step-by-step instructions on how to temporarily resolve it by overriding the install command in Vercel settings using `npm install --legacy-peer-deps`. The agent also advised on the long-term solution of migrating to a compatible drag-and-drop library.
---
