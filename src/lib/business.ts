import { db } from "@/lib/db";

export { isValidTimeZone, normalizeTimeZone } from "@/lib/timezones";

/**
 * Valida el slug de un negocio. Formato: minúsculas, números y guiones,
 * sin guiones al inicio/final ni consecutivos. Devuelve el slug normalizado
 * o null si es inválido.
 */
export function normalizeSlug(input: string): string | null {
  const slug = input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!/^[a-z0-9](?:[a-z0-9-]{1,62}[a-z0-9])?$/.test(slug)) {
    return null;
  }

  return slug;
}

/**
 * Comprueba que el slug no esté en uso por otro negocio.
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const existing = await db.business.findUnique({
    where: { slug },
    select: { id: true },
  });

  return existing === null;
}
