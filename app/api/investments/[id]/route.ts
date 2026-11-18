import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const item = await prisma.fixedInvestment.findUnique({ where: { id } });
    if (!item) return fail("Investment not found", 404);
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
    if (d.category !== undefined) data.category = d.category;
    if (d.note !== undefined) data.note = d.note;
    if (d.amount !== undefined) data.amount = Number(d.amount);
    if (d.date !== undefined) data.date = new Date(d.date);
    const item = await prisma.fixedInvestment.update({ where: { id }, data });
    return ok(item);
  } catch (e) {
    return err(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.fixedInvestment.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e) {
    return err(e);
  }
}
