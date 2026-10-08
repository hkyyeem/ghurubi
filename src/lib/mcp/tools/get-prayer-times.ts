import { defineTool } from "@lovable.dev/mcp-js";
import { prayerTimesGhurubi } from "../ghurubi";
import { locationInput, resolveLocation } from "./location";

export default defineTool({
  name: "get_prayer_times",
  title: "Get prayer times",
  description: "Today's prayer times (Umm al-Qura method) expressed in Ghurubi time, where Maghrib is 00:00.",
  inputSchema: locationInput,
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: false },
  handler: (args) => {
    const loc = resolveLocation(args);
    const p = prayerTimesGhurubi(loc.latitude, loc.longitude);
    const text = `Prayer times${loc.name ? ` in ${loc.name}` : ""} (Ghurubi): Maghrib ${p.maghrib}, Isha ${p.isha}, Fajr ${p.fajr}, Sunrise ${p.sunrise}, Dhuhr ${p.dhuhr}, Asr ${p.asr}.`;
    return { content: [{ type: "text", text }], structuredContent: { location: loc, prayers: p } };
  },
});
