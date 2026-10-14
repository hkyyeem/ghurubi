
- The public MCP server lives in src/lib/mcp/ and reuses the app's sun/prayer/city libraries; it is public (no auth) because it only serves computed public time data — never add per-user data to it without switching to OAuth.
- Articles: static ones live in src/lib/articles.ts; admin-written ones live in the `articles` table (published rows public via RLS) and are merged at runtime, DB wins on slug. The first signed-up account becomes admin (trigger), roles in `user_roles`.
