
- The public MCP server lives in src/lib/mcp/ and reuses the app's sun/prayer/city libraries; it is public (no auth) because it only serves computed public time data — never add per-user data to it without switching to OAuth.
