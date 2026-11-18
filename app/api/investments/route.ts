import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const items = await prisma.fixedInvestment.findMany({
      where: category ? { category } : undefined,
      orderBy: { date: "desc" },
    });
    return ok(items);
  } catch (e) {
    return err(e);
  }
}

export async function POST(req: Request) {
  try {
    const d = await body<any>(req);
    if (!d.date || !d.category || d.amount == null) {
      return fail("date, category and amount are required", 400);
    }
    const item = await prisma.fixedInvestment.create({
      data: {
        date: new Date(d.date),
        category: d.category,
        amount: Number(d.amount),
        note: d.note ?? null,
      },
    });
    return ok(item, 201);
  } catch (e) {
    return err(e);
  }
}
