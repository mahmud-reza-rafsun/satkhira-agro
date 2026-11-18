import { prisma } from "@/lib/prisma";
import { err, fail, ok } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.businessPlan.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e) {
    return err(e);
  }
}
