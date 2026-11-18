import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

// Neon is reached over HTTPS through its serverless driver, because a
// raw Postgres TCP connection is not available from every network
// (this VM's egress proxy only passes HTTPS). The same adapter is the
// recommended setup for Neon + Vercel, so the app uses it everywhere.
// The Pool normally talks over WebSocket, which this network blocks —
// so Pool queries run over HTTPS fetch instead (the transport the plain
// `neon()` HTTP driver uses, which is proven to work here).
neonConfig.poolQueryViaFetch = true;

const connectionString = process.env.DATABASE_URL ?? "";

const adapter = new PrismaNeon({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/**
 * One PrismaClient for the whole app (Next.js dev reloads would otherwise
 * open a new database connection on every reload).
 */
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
