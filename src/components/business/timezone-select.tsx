"use client";

const DEFAULT_TIMEZONE = "America/Argentina/Buenos_Aires";

const timeZones = (Intl.supportedValuesOf("timeZone") as string[]).filter(
  (tz) => tz.startsWith("America/")
);

export function TimeZoneSelect() {
  return (
    <select
      id="timezone"
      name="timezone"
      defaultValue={DEFAULT_TIMEZONE}
      className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
    >
      {timeZones.map((tz) => (
        <option key={tz} value={tz}>
          {tz}
        </option>
      ))}
    </select>
  );
}
