import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const item = await prisma.growthProduct.findUnique({ where: { id } });
    if (!item) return fail("Growth product not found", 404);
    return ok(item);
  } catch (e) {
    return err(e);
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const d = await body<any>(req);
    const data: Record<string, unknown> = {};
    if (d.productName !== undefined) data.productName = d.productName;
    if (d.flock !== undefined) data.flock = d.flock;
    if (d.quantity !== undefined) data.quantity = Number(d.quantity);
    if (d.growthRate !== undefined) data.growthRate = d.growthRate == null ? null : Number(d.growthRate);
    if (d.months !== undefined) data.months = d.months == null ? null : Number(d.months);
    if (d.batchId !== undefined) data.batchId = d.batchId;
    const item = await prisma.growthProduct.update({ where: { id }, data });
    return ok(item);
  } catch (e) {
    return err(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.growthProduct.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e) {
    return err(e);
  }
}
