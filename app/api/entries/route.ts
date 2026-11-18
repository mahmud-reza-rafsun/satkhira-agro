import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kind = searchParams.get("kind");
    const flock = searchParams.get("flock");
    const entries = await prisma.ledgerEntry.findMany({
      where: {
        ...(kind ? { kind: kind as "PURCHASE_EXPENSE" | "SALE_INCOME" } : {}),
        ...(flock ? { flock } : {}),
      },
      orderBy: { date: "desc" },
    });
    return ok(entries);
  } catch (e) {
    return err(e);
  }
}

export async function POST(req: Request) {
  try {
    const d = await body<any>(req);
    if (!d.kind || !d.flock || d.amount == null || !d.date) {
      return fail("kind, flock, amount and date are required", 400);
    }
    if (d.kind !== "PURCHASE_EXPENSE" && d.kind !== "SALE_INCOME") {
      return fail("kind must be PURCHASE_EXPENSE or SALE_INCOME", 400);
    }
    const entry = await prisma.ledgerEntry.create({
      data: {
        kind: d.kind,
        flock: d.flock,
        batchNo: d.batchNo != null ? Number(d.batchNo) : null,
        batchId: d.batchId ?? null,
        amount: Number(d.amount),
        date: new Date(d.date),
        category: d.category ?? null,
        note: d.note ?? null,
      },
    });
    return ok(entry, 201);
  } catch (e) {
    return err(e);
  }
}
