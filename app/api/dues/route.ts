import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const settled = searchParams.get("settled");
    const items = await prisma.due.findMany({
      where: settled != null ? { settled: settled === "true" } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return ok(items);
  } catch (e) {
    return err(e);
  }
}

export async function POST(req: Request) {
  try {
    const d = await body<any>(req);
    if (!d.person || d.amount == null) {
      return fail("person and amount are required", 400);
    }
    const item = await prisma.due.create({
      data: {
        person: d.person,
        amount: Number(d.amount),
        date: d.date ? new Date(d.date) : null,
        note: d.note ?? null,
        settled: d.settled === true,
      },
    });
    return ok(item, 201);
  } catch (e) {
    return err(e);
  }
}
