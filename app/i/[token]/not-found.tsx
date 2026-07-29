export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-night text-felt text-center px-6">
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-gold mb-3">404</p>
        <h1 className="font-display text-2xl mb-2">Урилга олдсонгүй</h1>
        <p className="text-felt/60 text-sm">
          Энэ линк хүчингүй байна. Зохион байгуулагчтай холбогдоно уу.
        </p>
      </div>
    </main>
  );
}
