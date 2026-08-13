"use client";

import { ARGENTINA_TIMEZONES, DEFAULT_TIMEZONE } from "@/lib/timezones";

export function TimeZoneSelect() {
  return (
    <select
      id="timezone"
      name="timezone"
      defaultValue={DEFAULT_TIMEZONE}
      className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
    >
      {ARGENTINA_TIMEZONES.map((tz) => (
        <option key={tz.value} value={tz.value}>
          {tz.label}
        </option>
      ))}
    </select>
  );
}
