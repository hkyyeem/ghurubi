import { z } from "zod";
import { ToolError } from "@lovable.dev/mcp-js";
import { resolveCity } from "../ghurubi";

export const locationInput = {
  city: z.string().optional().describe("City name or slug from list_cities, e.g. 'Riyadh' or 'makkah'."),
  latitude: z.number().min(-90).max(90).optional().describe("Latitude, used when no city is given."),
  longitude: z.number().min(-180).max(180).optional().describe("Longitude, used when no city is given."),
};

export function resolveLocation(a: { city?: string; latitude?: number; longitude?: number }) {
  if (a.city) {
    const c = resolveCity(a.city);
    if (!c) throw new ToolError(`Unknown city "${a.city}". Use list_cities, or pass latitude and longitude.`);
    return { name: c.name, latitude: c.latitude, longitude: c.longitude };
  }
  if (a.latitude === undefined || a.longitude === undefined)
    throw new ToolError("Provide a city, or both latitude and longitude.");
  return { name: null, latitude: a.latitude, longitude: a.longitude };
}
