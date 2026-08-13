// Zonas horarias de Argentina (IANA). Lista curada: todas comparten el mismo
// offset (UTC-3) pero se ofrecen como opciones para compatibilidad con la
// convención IANA. La zona canónica de referencia es Buenos Aires.
export const ARGENTINA_TIMEZONES: { value: string; label: string }[] = [
  {
    value: "America/Argentina/Buenos_Aires",
    label: "Argentina (Buenos Aires)",
  },
  { value: "America/Argentina/Cordoba", label: "Argentina (Córdoba)" },
  { value: "America/Argentina/Salta", label: "Argentina (Salta)" },
  { value: "America/Argentina/Jujuy", label: "Argentina (Jujuy)" },
  { value: "America/Argentina/Tucuman", label: "Argentina (Tucumán)" },
  { value: "America/Argentina/Mendoza", label: "Argentina (Mendoza)" },
  { value: "America/Argentina/San_Juan", label: "Argentina (San Juan)" },
  { value: "America/Argentina/La_Rioja", label: "Argentina (La Rioja)" },
  { value: "America/Argentina/Catamarca", label: "Argentina (Catamarca)" },
  { value: "America/Argentina/San_Luis", label: "Argentina (San Luis)" },
  {
    value: "America/Argentina/Rio_Gallegos",
    label: "Argentina (Río Gallegos)",
  },
  { value: "America/Argentina/Ushuaia", label: "Argentina (Ushuaia)" },
];

export const DEFAULT_TIMEZONE = "America/Argentina/Buenos_Aires";

// Alias IANA que no aparecen en Intl.supportedValuesOf de algunos entornos.
// Se normalizan a su zona canónica para evitar duplicados al validar.
const TIMEZONE_ALIASES: Record<string, string> = {
  "America/Buenos_Aires": "America/Argentina/Buenos_Aires",
};

/**
 * Valida que un string sea una zona horaria IANA conocida. No depende de
 * Intl.supportedValuesOf (que varía entre entornos): construye un formatter
 * y detecta si el motor acepta la zona.
 */
export function isValidTimeZone(timezone: string): boolean {
  if (!timezone || typeof timezone !== "string") {
    return false;
  }

  const canonical = TIMEZONE_ALIASES[timezone] ?? timezone;

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: canonical });
    return true;
  } catch {
    return false;
  }
}

/**
 * Normaliza una zona horaria a su nombre canónico IANA.
 * Devuelve la zona sin cambios si no hay un alias conocido.
 */
export function normalizeTimeZone(timezone: string): string {
  return TIMEZONE_ALIASES[timezone] ?? timezone;
}
