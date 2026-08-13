import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import type { User } from "@/generated/prisma/client";

/**
 * Devuelve el User de la aplicación correspondiente a la sesión actual de
 * Clerk, o null si no hay sesión.
 *
 * La identidad se deriva SIEMPRE de la sesión del servidor (clerkId), nunca de
 * datos enviados por el cliente. Si el usuario aún no existe en nuestra base
 * de datos, se crea (upsert perezoso) con los datos de su perfil en Clerk.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const clerk = await clerkClient();
  const profile = await clerk.users.getUser(userId);

  return db.user.upsert({
    where: { clerkId: userId },
    create: {
      clerkId: userId,
      email: profile.primaryEmailAddress?.emailAddress ?? "",
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.primaryPhoneNumber?.phoneNumber,
    },
    update: {
      email: profile.primaryEmailAddress?.emailAddress ?? "",
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.primaryPhoneNumber?.phoneNumber,
    },
  });
}

/**
 * Igual que getCurrentUser pero lanza un error si no hay sesión activa.
 * Debe usarse en server actions y rutas donde la autenticación es obligatoria.
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No autenticado.");
  }

  return user;
}
