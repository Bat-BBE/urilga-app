import { randomBytes } from "crypto";

// URL-д ээлтэй, товч, ойлгомжгүй token үүсгэнэ (жишээ нь: af8sj19a)
export function generateToken(length = 8): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789"; // ойлгомжгүй үсэг тоог хассан
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[bytes[i] % chars.length];
  }
  return out;
}
