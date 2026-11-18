import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const staff = await prisma.staff.findMany({
      where: month ? { month } : undefined,
      orderBy: [{ month: "desc" }, { name: "asc" }],
    });
    return ok(staff);
  } catch (e) {
    return err(e);
  }
}

export async function POST(req: Request) {
  try {
    const d = await body<any>(req);
    if (!d.name || !d.month || d.salary == null) {
      return fail("name, month and salary are required", 400);
    }
    const member = await prisma.staff.create({
      data: {
        name: d.name,
        month: d.month,
        salary: Number(d.salary),
        paid: d.paid != null ? Number(d.paid) : 0,
      },
    });
    return ok(member, 201);
  } catch (e) {
    return err(e);
  }
}
