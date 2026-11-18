import { prisma } from "@/lib/prisma";
import { err, fail, ok } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const row = await prisma.stock.findUnique({ where: { id } });
    if (!row) return fail("Stock not found", 404);
    return ok(row);
  } catch (e) {
    return err(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.stock.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e) {
    return err(e);
  }
}
