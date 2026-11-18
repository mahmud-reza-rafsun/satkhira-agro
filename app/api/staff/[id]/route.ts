import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const member = await prisma.staff.findUnique({ where: { id } });
    if (!member) return fail("Staff not found", 404);
    return ok(member);
  } catch (e) {
    return err(e);
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const d = await body<any>(req);
    const data: Record<string, unknown> = {};
    if (d.name !== undefined) data.name = d.name;
    if (d.month !== undefined) data.month = d.month;
    if (d.salary !== undefined) data.salary = Number(d.salary);
    if (d.paid !== undefined) data.paid = Number(d.paid);
    const member = await prisma.staff.update({ where: { id }, data });
    return ok(member);
  } catch (e) {
    return err(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.staff.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e) {
    return err(e);
  }
}
