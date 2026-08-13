import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Turnos para tu negocio, sin complicaciones.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Administrá servicios, profesionales y horarios. Tus clientes reservan
          en segundos y reciben confirmaciones automáticas.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="w-full rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 sm:w-auto dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Crear cuenta gratis
          </Link>
          <Link
            href="/sign-in"
            className="w-full rounded-md border border-zinc-300 px-6 py-3 text-sm font-medium hover:bg-zinc-100 sm:w-auto dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </main>
    </div>
  );
}
