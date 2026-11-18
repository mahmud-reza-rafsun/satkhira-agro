import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact) return fail("Contact not found", 404);
    return ok(contact);
  } catch (e) {
    return err(e);
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const d = await body<any>(req);
    const data: Record<string, unknown> = {};
    for (const k of ["kind", "name", "phone", "address", "remark"]) {
      if (d[k] !== undefined) data[k] = d[k];
    }
    const contact = await prisma.contact.update({ where: { id }, data });
    return ok(contact);
  } catch (e) {
    return err(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.contact.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e) {
    return err(e);
  }
}
