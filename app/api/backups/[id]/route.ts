import { prisma } from "@/lib/prisma";
import { err, fail, ok } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const item = await prisma.backup.findUnique({ where: { id } });
    if (!item) return fail("Backup not found", 404);
    return ok(item);
  } catch (e) {
    return err(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.backup.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e) {
    return err(e);
  }
}
