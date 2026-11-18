import { neon } from "@neondatabase/serverless";

async function main(): Promise<void> {
  const sql = neon(process.env.DATABASE_URL!);
  const tables = (await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY 1
  `) as Array<{ table_name: string }>;
  console.log("tables:", tables.map((t) => t.table_name).join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
