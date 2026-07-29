export default function HomePage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center bg-night text-felt px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-lattice opacity-60"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(232,200,119,0.14), transparent 60%), linear-gradient(180deg, rgba(24,19,33,0.4), rgba(24,19,33,0.95))",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-lg text-center">
        <p className="font-utility text-xs tracking-[0.3em] uppercase text-gold mb-5">
          Хурим найр · урилгын систем
        </p>

        <h1 className="font-display italic text-4xl sm:text-5xl leading-tight mb-6 text-goldBright">
          Урилга үүсгэх
        </h1>

        <p className="font-body text-felt/70 text-base leading-relaxed mb-10 max-w-sm mx-auto">
          Зочин бүрт өөрийнх нь нэрээр бичигдсэн хувийн урилгын хаалга. Нэрсийг
          оруулж, линкийг тараахад л хангалттай.
        </p>

        <a
          href="/admin"
          className="font-utility inline-flex items-center gap-2 bg-gold text-night text-sm font-medium tracking-wide px-7 py-3 rounded-full hover:bg-goldBright transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldBright"
        >
          Зочдоо удирдах
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </main>
  );
}
