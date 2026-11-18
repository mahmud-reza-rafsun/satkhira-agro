import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const entry = await prisma.ledgerEntry.findUnique({ where: { id } });
    if (!entry) return fail("Entry not found", 404);
    return ok(entry);
  } catch (e) {
    return err(e);
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const d = await body<any>(req);
    const data: Record<string, unknown> = {};
    for (const k of ["kind", "flock", "batchId", "category", "note"]) {
      if (d[k] !== undefined) data[k] = d[k];
    }
    if (d.batchNo !== undefined) data.batchNo = d.batchNo == null ? null : Number(d.batchNo);
    if (d.amount !== undefined) data.amount = Number(d.amount);
    if (d.date !== undefined) data.date = new Date(d.date);
    const entry = await prisma.ledgerEntry.update({ where: { id }, data });
    return ok(entry);
  } catch (e) {
    return err(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.ledgerEntry.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e) {
    return err(e);
  }
}
