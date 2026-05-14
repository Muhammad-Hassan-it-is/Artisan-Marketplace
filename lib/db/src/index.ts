import * as schema from "./schema";

export let db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema>;
export let pool: import("pg").Pool | null = null;

if (process.env.DATABASE_URL) {
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const pg = await import("pg");
  pool = new pg.default.Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
} else {
  db = null as any;
}

export * from "./schema";
