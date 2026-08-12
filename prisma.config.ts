import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Neon: conexión directa (sin pooler) para CLI (migraciones, studio).
    // La app en runtime usa DATABASE_URL (pooled) mediante @prisma/adapter-neon.
    url: process.env["DIRECT_URL"] ?? "",
  },
});
