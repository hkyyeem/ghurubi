import { defineTool } from "@lovable.dev/mcp-js";
import { MAJOR_CITIES, citySlug } from "@/lib/cityCoordinates";

export default defineTool({
  name: "list_cities",
  title: "List cities",
  description: "List the cities Ghurubi knows by name, with their slug, country and coordinates.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const cities = MAJOR_CITIES.map((c) => ({
      slug: citySlug(c), name: c.name, nameAr: c.nameAr, country: c.country,
      latitude: c.latitude, longitude: c.longitude,
    }));
    return {
      content: [{ type: "text", text: cities.map((c) => `${c.name} (${c.slug}), ${c.country}`).join("\n") }],
      structuredContent: { cities },
    };
  },
});
