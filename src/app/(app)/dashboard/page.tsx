import { redirect } from "next/navigation";
import { getMemberships } from "@/lib/multi-tenant";

export default async function DashboardPage() {
  const memberships = await getMemberships();

  if (memberships.length === 0) {
    redirect("/onboarding");
  }

  const business = memberships[0].business;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-6 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Negocio</p>
        <h2 className="mt-1 text-xl font-semibold">{business.name}</h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Slug</dt>
            <dd className="font-mono text-sm">{business.slug}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">
              Zona horaria
            </dt>
            <dd className="text-sm">{business.timezone}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">
              Rol en el negocio
            </dt>
            <dd className="text-sm">{memberships[0].role}</dd>
          </div>
        </dl>
      </div>
      <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
        Los próximos pasos (servicios, profesionales, horarios y turnos) se
        agregan en las siguientes fases.
      </p>
    </div>
  );
}
