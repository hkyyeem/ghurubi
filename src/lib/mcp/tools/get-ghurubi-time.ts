import { defineTool } from "@lovable.dev/mcp-js";
import { ghurubiNow } from "../ghurubi";
import { locationInput, resolveLocation } from "./location";

export default defineTool({
  name: "get_ghurubi_time",
  title: "Get Ghurubi time",
  description: "Current sunset-based (Ghurubi) time for a city or coordinates: sunset is 00:00 and the night comes first.",
  inputSchema: locationInput,
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: false },
  handler: (args) => {
    const loc = resolveLocation(args);
    const { daySunset: _omit, ...t } = ghurubiNow(loc.latitude, loc.longitude);
    const result = { location: loc, ...t };
    const text = `Ghurubi time${loc.name ? ` in ${loc.name}` : ""}: ${t.ghurubiTime} (${t.period}). Seasonal hours: ${t.seasonalTime}. Sunrise at ${t.sunriseGhurubi}. Next sunset in ${t.minutesToNextSunset} min.`;
    return { content: [{ type: "text", text }], structuredContent: result };
  },
});
