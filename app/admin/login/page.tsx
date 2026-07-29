"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Нэвтэрч чадсангүй. Дахин оролдоно уу.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-night px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-lattice opacity-50"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(232,200,119,0.10), transparent 55%)",
        }}
        aria-hidden="true"
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm bg-night/70 backdrop-blur-sm border border-gold/25 rounded-2xl px-8 py-9 text-felt shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
      >
        <h1 className="font-display text-2xl mb-1 text-center">Нэвтрэх</h1>
        <p className="font-body text-sm text-felt/55 mb-7">
          Зочдын жагсаалтад хандахын тулд нууц үгээ оруулна уу.
        </p>

        <label
          htmlFor="password"
          className="font-utility block text-xs uppercase tracking-wide text-goldBright mb-2"
        >
          Нууц үг
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="font-utility w-full bg-black/20 border border-gold/30 rounded-lg px-3 py-2.5 mb-5 outline-none transition-colors focus:border-goldBright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldBright"
          autoFocus
          autoComplete="current-password"
        />

        {error && (
          <p
            role="alert"
            className="font-utility text-ceremony bg-ceremony/10 border border-ceremony/30 rounded-lg px-3 py-2 text-sm mb-5"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="font-utility w-full bg-gold text-night font-semibold tracking-wide rounded-lg py-2.5 hover:bg-goldBright transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldBright"
        >
          {loading ? "Шалгаж байна…" : "Нэвтрэх"}
        </button>
      </form>
    </main>
  );
}
