"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { SIDE_LABELS, type GuestSide } from "@/lib/side";

type Guest = {
  id: string;
  name: string;
  description: string | null;
  side: GuestSide | null;
  token: string;
  createdAt: string;
  viewedAt: string | null;
};

export function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={handleLogout}
      className="font-utility text-sm text-wood/50 hover:text-wood transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold rounded"
    >
      Гарах
    </button>
  );
}

type SideFilter = "all" | GuestSide;

export default function AdminClient({
  initialGuests,
  baseUrl,
}: {
  initialGuests: Guest[];
  baseUrl: string;
}) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [namesText, setNamesText] = useState("");
  const [search, setSearch] = useState("");
  const [sideFilter, setSideFilter] = useState<SideFilter>("all");
  const [loading, setLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredGuests = useMemo(() => {
    return guests
      .filter((g) => (sideFilter === "all" ? true : g.side === sideFilter))
      .filter((g) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        return (
          g.name.toLowerCase().includes(q) ||
          (g.description ?? "").toLowerCase().includes(q)
        );
      });
  }, [guests, search, sideFilter]);

  type Entry = { name: string; description?: string; side?: string };

  async function submitEntries(entries: Entry[]) {
    if (entries.length === 0) return;
    setLoading(true);
    setImportError(null);
    try {
      const res = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      const data = await res.json();
      if (res.ok) {
        setGuests((prev) => [...data.guests, ...prev]);
        router.refresh();
      } else {
        setImportError(data.error ?? "Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const entries: Entry[] = namesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, description, side] = line.split("|");
        return {
          name: (name ?? "").trim(),
          description: description?.trim() || undefined,
          side: side?.trim() || undefined,
        };
      })
      .filter((e) => e.name.length > 0);
    await submitEntries(entries);
    setNamesText("");
  }

  const HEADER_LABELS = ["нэр", "name", "овог нэр", "guest", "зочин"];

  async function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: unknown[][] = XLSX.utils.sheet_to_json(firstSheet, {
        header: 1,
      });

      const entries: Entry[] = rows
        .map((row) => ({
          name: row?.[0] != null ? String(row[0]).trim() : "",
          description: row?.[1] != null ? String(row[1]).trim() : "",
          side: row?.[2] != null ? String(row[2]).trim() : "",
        }))
        .filter((e) => e.name.length > 0)
        .filter((e) => !HEADER_LABELS.includes(e.name.toLowerCase()))
        .map((e) => ({
          name: e.name,
          description: e.description || undefined,
          side: e.side || undefined,
        }));

      if (entries.length === 0) {
        setImportError(
          "Файлаас нэр олдсонгүй. A баганад нэрс байгаа эсэхийг шалгаад дахин оролдоно уу.",
        );
        return;
      }

      await submitEntries(entries);
    } catch {
      setImportError(
        "Файлыг уншиж чадсангүй. .xlsx, .xls эсвэл .csv файл сонгоно уу.",
      );
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Энэ зочныг устгах уу? Урилгын линк дахин ажиллахгүй болно."))
      return;
    setGuests((prev) => prev.filter((g) => g.id !== id));
    await fetch(`/api/admin/guests/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function linkFor(token: string) {
    return `${baseUrl}/i/${token}`;
  }

  async function handleCopy(guest: Guest) {
    await navigator.clipboard.writeText(linkFor(guest.token));
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  const totalHusband = guests.filter((g) => g.side === "husband").length;
  const totalWife = guests.filter((g) => g.side === "wife").length;
  const totalViewed = guests.filter((g) => g.viewedAt).length;

  return (
    <div className="font-utility space-y-8">
      {/* stat strip */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Нийт зочин" value={guests.length} />
        <StatCard label="Урилгаа үзсэн" value={totalViewed} />
        <StatCard
          label="Тал тодорхойгүй"
          value={guests.length - totalHusband - totalWife}
          muted
        />
      </div>

      {/* import panel */}
      <div className="bg-white/60 border border-wood/15 rounded-xl p-5 space-y-5">
        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-gold mb-1">
            Зочин нэмэх
          </p>
          <label className="block text-sm text-wood/70 mb-3">
            Excel/CSV файлаас import хийх — A: нэр, B: тайлбар, C: тал
            (&quot;нөхөр&quot; эсвэл &quot;эхнэр&quot;). B, C заавал биш.
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="bg-gold text-night text-sm font-medium rounded-lg px-4 py-2 hover:bg-goldBright transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood"
            >
              {loading ? "Import хийж байна…" : "Файл сонгох"}
            </button>
            <span className="text-xs text-wood/45">.xlsx · .xls · .csv</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileImport}
            className="hidden"
          />
          {importError && (
            <p
              role="alert"
              className="text-ceremony bg-ceremony/10 border border-ceremony/25 rounded-lg px-3 py-2 text-xs mt-3"
            >
              {importError}
            </p>
          )}
        </div>

        <div className="stitch pt-5">
          <form onSubmit={handleAdd}>
            <label className="block text-sm text-wood/70 mb-2">
              Эсвэл гараар бичих — мөр бүрт:{" "}
              <code className="bg-wood/10 px-1 rounded">
                Нэр | Тайлбар | Тал
              </code>{" "}
              (сүүлийн хоёр заавал биш)
            </label>
            <textarea
              value={namesText}
              onChange={(e) => setNamesText(e.target.value)}
              rows={4}
              placeholder={
                "Б.Бат-Эрдэнэ | Ах дүү | нөхөр\nС.Болд | Найз | эхнэр\nЖ.Даваа"
              }
              className="font-body w-full border border-wood/20 rounded-lg px-3 py-2 bg-white outline-none transition-colors focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-3 bg-wood text-felt text-sm font-medium rounded-lg px-4 py-2 hover:bg-wood/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wood"
            >
              {loading ? "Нэмж байна…" : "Урилгын линк үүсгэх"}
            </button>
          </form>
        </div>
      </div>

      {/* list panel */}
      <div className="bg-white/60 border border-wood/15 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-wood/10 space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Нэр эсвэл тайлбараар хайх…"
            className="w-full border border-wood/20 rounded-lg px-3 py-2 bg-white outline-none text-sm transition-colors focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          />
          <div className="flex gap-2">
            {(
              [
                ["all", `Бүгд · ${guests.length}`],
                ["husband", `${SIDE_LABELS.husband} · ${totalHusband}`],
                ["wife", `${SIDE_LABELS.wife} · ${totalWife}`],
              ] as [SideFilter, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSideFilter(value)}
                aria-pressed={sideFilter === value}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  sideFilter === value
                    ? "bg-wood text-felt border-wood"
                    : "border-wood/20 text-wood/60 hover:border-wood/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm overflow-x-auto">
            <thead>
              <tr className="text-left text-wood/50 border-b border-wood/10">
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide">
                  Нэр
                </th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide">
                  Тайлбар
                </th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide">
                  Тал
                </th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide">
                  Линк
                </th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide">
                  Үзсэн эсэх
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 && guests.length > 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <p className="text-wood/50 text-sm">
                      Энэ шүүлтэд тохирох зочин алга.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setSideFilter("all");
                      }}
                      className="text-ceremony underline text-xs mt-2"
                    >
                      Шүүлтийг арилгах
                    </button>
                  </td>
                </tr>
              )}
              {guests.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-wood/45 text-sm"
                  >
                    Одоогоор зочин алга. Дээрх талбараас Excel файл эсвэл нэр
                    оруулж эхэлнэ үү.
                  </td>
                </tr>
              )}
              {filteredGuests.map((guest) => (
                <tr
                  key={guest.id}
                  className={`border-b border-wood/5 transition-colors ${
                    search.trim() && filteredGuests.length === 1
                      ? "bg-gold/10"
                      : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-wood">
                    {guest.name}
                  </td>
                  <td className="px-4 py-3 text-wood/60">
                    {guest.description || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {guest.side ? (
                      <span
                        className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                          guest.side === "husband"
                            ? "bg-wood/10 text-wood"
                            : "bg-ceremony/10 text-ceremony"
                        }`}
                      >
                        {SIDE_LABELS[guest.side]}
                      </span>
                    ) : (
                      <span className="text-wood/25 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleCopy(guest)}
                      className="text-ceremony hover:text-ceremony/80 underline text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold rounded"
                    >
                      {copiedId === guest.id ? "Хууллаа ✓" : "Линк хуулах"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={
                        guest.viewedAt ? "text-wood/60" : "text-wood/30"
                      }
                    >
                      {guest.viewedAt ? "Үзсэн" : "Үзээгүй"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(guest.id)}
                      className="text-wood/35 hover:text-ceremony transition-colors text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold rounded"
                    >
                      Устгах
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 stitch text-xs text-wood/55 flex justify-between items-center">
          <span>
            {sideFilter === "all"
              ? "Бүх зочин"
              : SIDE_LABELS[sideFilter as GuestSide]}
            {search.trim() ? ` · хайлт: "${search}"` : ""}
          </span>
          <span className="font-semibold text-wood">
            Нийт: {filteredGuests.length} зочин
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  muted,
}: {
  label: string;
  value: number;
  muted?: boolean;
}) {
  return (
    <div className="bg-white/60 border border-wood/15 rounded-xl px-4 py-3">
      <p className="text-[0.65rem] uppercase tracking-wide text-wood/45 mb-1">
        {label}
      </p>
      <p
        className={`font-display text-2xl ${
          muted ? "text-wood/40" : "text-wood"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
