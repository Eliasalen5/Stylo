import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Protección resource-based: el acceso se valida en cada layout/página
  // que usa datos protegidos, no por matching de rutas en middleware.
  await auth.protect();

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex h-16 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
        <Link href="/dashboard" className="text-lg font-semibold">
          Stylo
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Dashboard
          </Link>
          <UserButton
            appearance={{
              elements: { userButtonBox: { justifyContent: "center" } },
            }}
          />
        </nav>
      </header>
      <main className="flex flex-1 flex-col px-6 py-8">{children}</main>
    </div>
  );
}
