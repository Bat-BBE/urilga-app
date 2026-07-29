import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

function sign(secret: string): string {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function getExpectedSessionValue(): string {
  const secret = process.env.ADMIN_SECRET ?? "";
  return sign(secret);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function setAdminCookie() {
  const value = getExpectedSessionValue();
  cookies().set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 хоног
  });
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME);
}

export function isAdminAuthenticated(): boolean {
  const cookie = cookies().get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  return cookie === getExpectedSessionValue();
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
