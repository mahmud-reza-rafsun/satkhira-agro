import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

// Server-side backup snapshots: the calculator's Backup JSON can be
// stored here (POST) and listed / fetched back (GET) for Restore.
export async function GET() {
  try {
    const items = await prisma.backup.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, label: true, createdAt: true },
    });
    return ok(items);
  } catch (e) {
    return err(e);
  }
}

export async function POST(req: Request) {
  try {
    const d = await body<any>(req);
    if (d.data == null || typeof d.data !== "object") {
      return fail("data (JSON object) is required", 400);
    }
    const item = await prisma.backup.create({
      data: { label: d.label ?? null, data: d.data },
    });
    return ok({ id: item.id, label: item.label, createdAt: item.createdAt }, 201);
  } catch (e) {
    return err(e);
  }
}
