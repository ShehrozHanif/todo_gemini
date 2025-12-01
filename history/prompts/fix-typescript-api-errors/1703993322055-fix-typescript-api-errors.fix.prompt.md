---
phr_id: 1703993322055
date: 2025-12-01
challenge: Fix TypeScript and API Error Handling
stage: fix
feature: fix-typescript-api-errors
commit_message: "fix(api): improve TypeScript and API error handling for Vercel deployment"
description: >
  Addressed TypeScript and API error handling issues in `frontend/src/services/api-client.ts`
  to ensure a successful production build and deployment on Vercel. This included robust
  error response parsing, safe property access, and compatibility with Next.js SSR.
---

### Execution Analysis:

The task was to fix all TypeScript and API error handling issues in the project, specifically in `frontend/src/services/api-client.ts`, to ensure a successful production build and deployment on Vercel.

1.  **Refactored `sendRequest` Function**:
    *   **Problem**: Original `sendRequest` had unsafe access to `errorData.message` if `errorData` was not an object (e.g., a plain string). It also lacked explicit error handling for `response.json()` on successful responses, potentially failing for malformed or empty JSON.
    *   **Fix**: Introduced an `ApiErrorResponse` interface for consistent error structure. Implemented `parseErrorResponse` to safely extract error messages, attempting JSON parsing and falling back to raw text. This function is now used to process error responses, ensuring `errorMessage` is always a string. A `try...catch` block was added around `await response.json()` for non-204 successful responses to handle potential JSON parsing failures.

2.  **SSR Compatibility for Offline Logic**:
    *   **Problem**: The `isOnline()` function and `window.addEventListener('online', ...)` directly accessed `navigator.onLine` and `window`, which are client-side specific and would cause errors in a Next.js SSR environment.
    *   **Fix**: Wrapped all direct accesses to `navigator.onLine` and `window.addEventListener` with `typeof window !== 'undefined'` checks. This ensures that the offline queueing mechanism and online/offline event listeners only activate when the code is executed in a browser environment, preventing SSR-related errors.

3.  **Improved `processQueue` Error Handling**:
    *   **Problem**: The `catch (error)` block in `processQueue` did not explicitly type the `error` variable, leading to potential implicit `any` issues in strict TypeScript environments.
    *   **Fix**: Changed `catch (error)` to `catch (error: unknown)` to enforce better type safety and require explicit type checking or assertion for the caught error.

These comprehensive changes ensure that the API client is resilient to various error scenarios, is type-safe, and is fully compatible with Next.js's rendering environments, making the project ready for Vercel deployment without build errors.

### Files Modified:

- `frontend/src/services/api-client.ts`

### User Prompt:

You are updating a Next.js 16 Advanced To-Do App project that uses TypeScript.

### GOAL
Fix **all TypeScript and API error handling issues** in the project to ensure successful production build and deployment on Vercel.

### CONTEXT
- The project uses Next.js 16, TypeScript, React, TailwindCSS.
- There are API calls handled in `src/services/api-client.ts` and potentially other service files.
- Current errors include:
  - Accessing `errorData.message` when `errorData` could be a string.
  - Possible `response.json()` failures when response is empty or invalid.
  - Any other TypeScript errors that prevent `next build` from succeeding.
- Local development works, but production build on Vercel fails due to strict TS checking.

### REQUIREMENTS
1. Ensure **all `fetch`/API calls** handle errors safely:
   - Check if `errorData` is an object before accessing `message`.
   - Provide fallback messages for strings or invalid JSON.
   - Catch JSON parse errors.
2. Make **TypeScript types safe**:
   - Use proper type guards.
   - Avoid implicit `any` or property access errors.
3. Ensure **all API calls and error handling** are compatible with Next.js SSR and client components.
4. Do **not break existing app functionality**.
5. Update only the necessary service files (`api-client.ts` or other API utilities) and related TypeScript code.
6. Make the project **Vercel deployment-ready**, no build errors.

### DELIVERABLES
- Corrected `src/services/api-client.ts` with safe error handling.
- Any other affected service or utility TypeScript files updated.
- TypeScript build passes locally and on Vercel.
- Minimal, precise code changes.

### IMPORTANT
- Provide **complete code blocks only**.
- Do **not rewrite unrelated UI components**.
- Focus on **TypeScript safety, error handling, and Vercel deployment readiness**.
