import { prisma } from "@/lib/prisma";
import { err, ok } from "@/lib/api";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return ok({ ok: true, db: "connected" });
  } catch (e) {
    console.error(e);
    return ok({ ok: false, db: "unreachable" }, 503);
  }
}
