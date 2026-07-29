export type GuestSide = "husband" | "wife";

export const SIDE_LABELS: Record<GuestSide, string> = {
  husband: "Нөхрийн тал",
  wife: "Эхнэрийн тал",
};

/**
 * Excel/CSV эсвэл гар аргаар оруулсан чөлөөт текстийг
 * "husband" | "wife" | null болгож нормалчилна.
 * Жишээ таарах утгууд: нөхөр, нөхрийн тал, хүргэн, husband, groom
 *                       эхнэр, эхнэрийн тал, бэр, wife, bride
 */
export function normalizeSide(input?: string | null): GuestSide | null {
  if (!input) return null;
  const v = input.trim().toLowerCase();
  if (!v) return null;

  const husbandKeywords = ["нөхөр", "хүргэн", "husband", "groom"];
  const wifeKeywords = ["эхнэр", "бэр", "wife", "bride"];

  if (husbandKeywords.some((k) => v.includes(k))) return "husband";
  if (wifeKeywords.some((k) => v.includes(k))) return "wife";
  return null;
}
