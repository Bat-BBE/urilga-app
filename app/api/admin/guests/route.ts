import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/tokens";
import { normalizeSide } from "@/lib/side";

export async function GET() {
  const guests = await prisma.guest.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ guests });
}

type IncomingEntry = { name?: unknown; description?: unknown; side?: unknown };

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rawEntries: unknown = body?.entries;

  if (!Array.isArray(rawEntries)) {
    return NextResponse.json(
      { error: "'entries' массив байх ёстой" },
      { status: 400 },
    );
  }

  const entries = (rawEntries as IncomingEntry[])
    .map((e) => ({
      name: typeof e?.name === "string" ? e.name.trim() : "",
      description:
        typeof e?.description === "string" && e.description.trim().length > 0
          ? e.description.trim()
          : null,
      side: normalizeSide(typeof e?.side === "string" ? e.side : null),
    }))
    .filter((e) => e.name.length > 0);

  if (entries.length === 0) {
    return NextResponse.json({ error: "Нэр олдсонгүй" }, { status: 400 });
  }

  const created = [];
  for (const entry of entries) {
    let token = generateToken();
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.guest.findUnique({ where: { token } });
      if (!exists) break;
      token = generateToken();
    }
    const guest = await prisma.guest.create({
      data: {
        name: entry.name,
        description: entry.description,
        side: entry.side,
        token,
      },
    });
    created.push(guest);
  }

  return NextResponse.json({ guests: created });
}
