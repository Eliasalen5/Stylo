import { BusinessForm } from "@/components/business/business-form";

export default function OnboardingPage() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <h1 className="text-2xl font-semibold">Creá tu negocio</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Configurá tu negocio para empezar a administrar turnos. Vas a poder
        cargar servicios, profesionales y horarios después.
      </p>

      <BusinessForm />
    </div>
  );
}
