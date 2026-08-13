"use client";

import { useActionState } from "react";
import { createBusiness, type CreateBusinessState } from "@/app/actions/business";
import { TimeZoneSelect } from "@/components/business/timezone-select";

const initialState: CreateBusinessState = {};

export function BusinessForm() {
  const [state, formAction, isPending] = useActionState(
    createBusiness,
    initialState
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.error && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {state.error}
        </p>
      )}

      <fieldset>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Nombre del negocio
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={120}
          placeholder="Ej: Barbería El Clásico"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {state.fieldErrors.name}
          </p>
        )}
      </fieldset>

      <fieldset>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium">
          Slug (dirección pública)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            stylo.app/
          </span>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            placeholder="mi-barberia"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        {state.fieldErrors?.slug ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {state.fieldErrors.slug}
          </p>
        ) : (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Solo letras, números y guiones. Es la URL pública de tu negocio.
          </p>
        )}
      </fieldset>

      <fieldset>
        <label htmlFor="timezone" className="mb-1 block text-sm font-medium">
          Zona horaria
        </label>
        <TimeZoneSelect />
        {state.fieldErrors?.timezone && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {state.fieldErrors.timezone}
          </p>
        )}
      </fieldset>

      <fieldset>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
          Teléfono (opcional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Ej: +54 11 5555 5555"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </fieldset>

      <fieldset>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium"
        >
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Contanos sobre tu negocio..."
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isPending ? "Creando..." : "Crear negocio"}
      </button>
    </form>
  );
}
