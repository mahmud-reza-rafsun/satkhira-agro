import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kind = searchParams.get("kind");
    const contacts = await prisma.contact.findMany({
      where: kind ? { kind: kind as "BUYER" | "SELLER" } : undefined,
      orderBy: { name: "asc" },
    });
    return ok(contacts);
  } catch (e) {
    return err(e);
  }
}

export async function POST(req: Request) {
  try {
    const d = await body<any>(req);
    if (!d.kind || !d.name) {
      return fail("kind and name are required", 400);
    }
    if (d.kind !== "BUYER" && d.kind !== "SELLER") {
      return fail("kind must be BUYER or SELLER", 400);
    }
    const contact = await prisma.contact.create({
      data: {
        kind: d.kind,
        name: d.name,
        phone: d.phone ?? null,
        address: d.address ?? null,
        remark: d.remark ?? null,
      },
    });
    return ok(contact, 201);
  } catch (e) {
    return err(e);
  }
}
