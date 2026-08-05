import "server-only";
import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error(
    "No database connection string found. Expected DATABASE_URL (or POSTGRES_URL) to be set.",
  );
}

// `neon()` returns a tagged-template SQL function that talks to Postgres
// over HTTP. This works reliably in serverless functions without needing
// to manage a connection pool.
export const sql = neon(connectionString);
