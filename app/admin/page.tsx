import { prisma } from "@/lib/prisma";
import AdminClient, { LogoutButton } from "./AdminClient";

export default async function AdminPage() {
  const guests = await prisma.guest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return (
    <main className="min-h-screen bg-felt px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-utility text-xs tracking-[0.25em] uppercase text-gold mb-1">
              Admin · {guests.length} зочин бүртгэлтэй
            </p>
            <h1 className="font-display text-3xl text-wood">Зочдын жагсаалт</h1>
          </div>
          <LogoutButton />
        </div>
        <div className="stitch mb-8" />

        <AdminClient
          initialGuests={guests.map((g) => ({
            id: g.id,
            name: g.name,
            description: g.description,
            side: g.side as "husband" | "wife" | null,
            token: g.token,
            createdAt: g.createdAt.toISOString(),
            viewedAt: g.viewedAt ? g.viewedAt.toISOString() : null,
          }))}
          baseUrl={baseUrl}
        />
      </div>
    </main>
  );
}
