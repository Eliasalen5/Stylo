import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Prisma, type Role } from "@/generated/prisma/client";

export type MembershipWithBusiness = Prisma.BusinessMemberGetPayload<{
  include: { business: true };
}>;

/**
 * Devuelve las membresías (BusinessMember) del usuario autenticado.
 * Si no hay sesión, devuelve una lista vacía.
 */
export async function getMemberships(): Promise<MembershipWithBusiness[]> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  return db.businessMember.findMany({
    where: { userId: user.id },
    include: {
      business: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Comprueba que el usuario autenticado pertenezca al negocio indicado.
 *
 * El businessId SIEMPRE se valida contra la sesión del servidor: si el usuario
 * no es miembro, se responde 404 (sin revelar la existencia del recurso).
 * Devuelve la membresía con el rol correspondiente.
 */
export async function requireBusinessMember(
  businessId: string
): Promise<MembershipWithBusiness> {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const membership = await db.businessMember.findUnique({
    where: {
      businessId_userId: {
        businessId,
        userId: user!.id,
      },
    },
    include: {
      business: true,
    },
  });

  if (!membership) {
    notFound();
  }

  return membership;
}

/**
 * Comprueba que el usuario autenticado tenga un rol específico dentro del
 * negocio indicado. Se usa para restringir operaciones a OWNER.
 */
export async function requireRole(
  businessId: string,
  role: Role
): Promise<MembershipWithBusiness> {
  const membership = await requireBusinessMember(businessId);

  if (membership.role !== role) {
    notFound();
  }

  return membership;
}
