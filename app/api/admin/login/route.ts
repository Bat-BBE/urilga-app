import { NextRequest, NextResponse } from "next/server";
import { checkPassword, setAdminCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (typeof password !== "string" || !checkPassword(password)) {
    return NextResponse.json({ error: "Нууц үг буруу байна" }, { status: 401 });
  }

  setAdminCookie();
  return NextResponse.json({ ok: true });
}
