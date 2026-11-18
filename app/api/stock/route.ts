import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flock = searchParams.get("flock");
    const rows = await prisma.stock.findMany({
      where: flock ? { flock } : undefined,
      orderBy: [{ flock: "asc" }, { batchNo: "asc" }],
      include: { batch: true },
    });
    return ok(rows);
  } catch (e) {
    return err(e);
  }
}

// Upsert current stock for one flock + batch number.
export async function POST(req: Request) {
  try {
    const d = await body<any>(req);
    if (!d.flock || d.batchNo == null || d.current == null) {
      return fail("flock, batchNo and current are required", 400);
    }
    const row = await prisma.stock.upsert({
      where: { flock_batchNo: { flock: d.flock, batchNo: Number(d.batchNo) } },
      update: { current: Number(d.current), batchId: d.batchId ?? undefined },
      create: {
        flock: d.flock,
        batchNo: Number(d.batchNo),
        current: Number(d.current),
        batchId: d.batchId ?? null,
      },
    });
    return ok(row, 201);
  } catch (e) {
    return err(e);
  }
}
