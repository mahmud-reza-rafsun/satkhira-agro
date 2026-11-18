import { prisma } from "@/lib/prisma";
import { body, err, fail, ok } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flock = searchParams.get("flock");
    const items = await prisma.growthProduct.findMany({
      where: flock ? { flock } : undefined,
      orderBy: { createdAt: "desc" },
      include: { batch: true },
    });
    return ok(items);
  } catch (e) {
    return err(e);
  }
}

export async function POST(req: Request) {
  try {
    const d = await body<any>(req);
    if (!d.productName || d.quantity == null) {
      return fail("productName and quantity are required", 400);
    }
    const item = await prisma.growthProduct.create({
      data: {
        productName: d.productName,
        flock: d.flock ?? null,
        quantity: Number(d.quantity),
        growthRate: d.growthRate != null ? Number(d.growthRate) : null,
        months: d.months != null ? Number(d.months) : null,
        batchId: d.batchId ?? null,
      },
    });
    return ok(item, 201);
  } catch (e) {
    return err(e);
  }
}
