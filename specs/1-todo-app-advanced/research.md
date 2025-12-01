# Research: Advanced To-Do App Backend Database

## Decision

**Database Technology**: SQLite (or similar file-based/serverless database suitable for Vercel deployment, e.g., PlanetScale, Turso).

## Rationale

For a small, full-stack Next.js To-Do application deployed on Vercel, a lightweight, easy-to-integrate, and scalable database solution is paramount. SQLite offers simplicity for local development and can be effectively used with serverless functions on Vercel via projects like `better-sqlite3` (for Node.js environments) or by integrating with services that provide file-based or serverless database access. Should the application require more scalability or a relational structure without the overhead of a traditional database server, serverless SQL databases like PlanetScale (MySQL-compatible) or Turso (SQLite-compatible) are excellent choices that integrate well with Vercel's serverless platform. This approach minimizes operational overhead and aligns with the serverless paradigm of Vercel.

## Alternatives Considered

*   **PostgreSQL/MongoDB (traditional deployments)**:
    *   **Reason for Rejection**: Overkill for the initial scope of a simple To-Do application. Requires managing a dedicated database server or relying on a managed service, which adds complexity, cost, and operational burden not justified by the current feature set. Integration with Vercel's serverless functions would also typically require external connection management, which can be more complex than file-based or serverless-native options.

*   **Firebase/Supabase (full Backend-as-a-Service)**:
    *   **Reason for Rejection**: While these platforms offer a comprehensive suite of backend services (database, authentication, storage, etc.), they might introduce more features and vendor lock-in than strictly required for just the database aspect at this stage. The intent is to use Next.js API routes for direct backend control, making a pure database solution a more fitting choice. If a full BaaS is later deemed necessary, it would be a separate architectural decision.
