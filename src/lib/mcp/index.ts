import { defineMcp } from "@lovable.dev/mcp-js";
import getGhurubiTime from "./tools/get-ghurubi-time";
import getPrayerTimes from "./tools/get-prayer-times";
import listCities from "./tools/list-cities";

export default defineMcp({
  name: "ghurubi",
  title: "Ghurubi",
  version: "0.1.0",
  instructions:
    "Ghurubi is a natural sunset-based clock: sunset is 00:00 and the day begins with the night. Use get_ghurubi_time for the current time, get_prayer_times for prayer times in Ghurubi time, and list_cities to find supported city names. Never convert results to standard civil time unless the user asks.",
  tools: [getGhurubiTime, getPrayerTimes, listCities],
});
