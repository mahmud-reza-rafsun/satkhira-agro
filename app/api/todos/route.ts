import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

export async function GET() {
  try {
    const items = await prisma.todo.findMany({
      orderBy: [{ done: "asc" }, { createdAt: "desc" }],
    });
    return ok(items);
  } catch (e) {
    return err(e);
  }
}

export async function POST(req: Request) {
  try {
    const d = await body<any>(req);
    if (!d.text) return fail("text is required", 400);
    const item = await prisma.todo.create({
      data: { text: d.text, done: d.done === true },
    });
    return ok(item, 201);
  } catch (e) {
    return err(e);
  }
}
