import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flock = searchParams.get("flock");
    const batches = await prisma.batch.findMany({
      where: flock ? { flock } : undefined,
      orderBy: [{ flock: "asc" }, { batchNo: "asc" }],
      include: { stock: true },
    });
    return ok(batches);
  } catch (e) {
    return err(e);
  }
}

export async function POST(req: Request) {
  try {
    const d = await body<any>(req);
    if (!d.flock || !d.name || d.batchNo == null || !d.date) {
      return fail("flock, name, batchNo and date are required", 400);
    }
    const batch = await prisma.batch.create({
      data: {
        flock: d.flock,
        subFlock: d.subFlock ?? null,
        name: d.name,
        batchNo: Number(d.batchNo),
        rate: d.rate != null ? Number(d.rate) : null,
        totalValue: d.totalValue != null ? Number(d.totalValue) : null,
        source: d.source ?? null,
        remark: d.remark ?? null,
        date: new Date(d.date),
        growthRate: d.growthRate != null ? Number(d.growthRate) : null,
        growthMonths: d.growthMonths != null ? Number(d.growthMonths) : null,
      },
    });
    return ok(batch, 201);
  } catch (e) {
    return err(e);
  }
}
