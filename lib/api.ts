import { NextResponse } from "next/server";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function err(e: unknown) {
  console.error(e);
  return fail(e instanceof Error ? e.message : "Something went wrong");
}

export async function body<T>(req: Request): Promise<T> {
  return (await req.json()) as T;
}
