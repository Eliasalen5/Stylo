"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { normalizeSlug, isSlugAvailable, isValidTimeZone } from "@/lib/business";
import { normalizeTimeZone } from "@/lib/timezones";

export type CreateBusinessState = {
  error?: string;
  fieldErrors?: {
    name?: string;
    slug?: string;
    timezone?: string;
  };
};

/**
 * Crea un negocio (tenant) y registra al usuario autenticado como OWNER.
 *
 * Seguridad:
 *  - El usuario proviene de la sesión del servidor (requireAuth).
 *  - No se acepta userId/businessId/role desde el cliente.
 *  - Todo se valida en servidor y se crea en una transacción.
 */
export async function createBusiness(
  _prevState: CreateBusinessState,
  formData: FormData
): Promise<CreateBusinessState> {
  const user = await requireAuth();

  const name = formData.get("name")?.toString().trim() ?? "";
  const slugInput = formData.get("slug")?.toString() ?? "";
  const timezone = formData.get("timezone")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() || null;
  const description = formData.get("description")?.toString().trim() || null;

  const fieldErrors: NonNullable<CreateBusinessState["fieldErrors"]> = {};

  if (!name) {
    fieldErrors.name = "El nombre es obligatorio.";
  } else if (name.length > 120) {
    fieldErrors.name = "El nombre no puede superar los 120 caracteres.";
  }

  const slug = normalizeSlug(slugInput);
  if (!slug) {
    fieldErrors.slug =
      "El slug solo puede contener letras, números y guiones (ej: mi-barberia).";
  } else if (await isSlugAvailable(slug) === false) {
    fieldErrors.slug = "Ese slug ya está en uso. Elegí otro.";
  }

  if (!isValidTimeZone(timezone)) {
    fieldErrors.timezone = "La zona horaria no es válida.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const storedTimezone = normalizeTimeZone(timezone);

  try {
    // Nested create: crea Business + BusinessMember (OWNER) en una sola
    // operación atómica. El usuario proviene de la sesión autenticada.
    await db.user.update({
      where: { id: user.id },
      data: {
        memberships: {
          create: {
            role: "OWNER",
            business: {
              create: {
                name,
                slug: slug!,
                description,
                phone,
                timezone: storedTimezone,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    // El slug tiene un índice único: si otro request lo creó primero,
    // la transacción falla y mostramos un error claro.
    console.error("Error al crear negocio", error);
    return { error: "No se pudo crear el negocio. Intentalo de nuevo." };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard?business=${slug}`);
}
