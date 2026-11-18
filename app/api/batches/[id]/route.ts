import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: { stock: true, entries: true, growthProducts: true },
    });
    if (!batch) return fail("Batch not found", 404);
    return ok(batch);
  } catch (e) {
    return err(e);
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const d = await body<any>(req);
    const data: Record<string, unknown> = {};
    for (const k of [
      "flock",
      "subFlock",
      "name",
      "source",
      "remark",
    ]) {
      if (d[k] !== undefined) data[k] = d[k];
    }
    for (const k of ["batchNo", "rate", "totalValue", "growthRate", "growthMonths"]) {
      if (d[k] !== undefined) data[k] = d[k] == null ? null : Number(d[k]);
    }
    if (d.date !== undefined) data.date = new Date(d.date);
    const batch = await prisma.batch.update({ where: { id }, data });
    return ok(batch);
  } catch (e) {
    return err(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.batch.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e) {
    return err(e);
  }
}
