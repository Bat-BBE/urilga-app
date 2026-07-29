# Урилга биш, дурсамж — invite app

Гэрийн найрын хувийн дижитал урилга. Admin хэсгээс зочдын нэрийг оруулахад
хувь тус бүрд нь `/i/<token>` хэлбэрийн урилгын линк үүсдэг. Зочин линкээ
нээхэд шууд өөрийнх нь нэрээр personalize хийгдсэн cinematic урилгыг үзнэ.

## Технологи

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL (Neon эсвэл Supabase санал болгож байна)
- Cookie-д суурилсан энгийн admin auth (нэг нууц үгээр)

## Excel/CSV файлын бүтэц

| A (нэр) | B (тайлбар — заавал биш) |
|---|---|
| Б.Бат-Эрдэнэ | Ах дүү |
| С.Болд | Найз |
| Ж.Даваа | |

- A багана — зочны нэр (заавал байх ёстой)
- B багана — тухайн хүн хэн бэ гэдгийг тодорхойлсон тайлбар (жишээ нь харилцаа,
  бүлэг). Заавал биш, зөвхөн admin-д харагдана, урилга дээр гарахгүй.
- Эхний мөрөнд "Нэр"/"Name" гэх мэт толгой мөр байвал систем автоматаар алгасна.

## Кино мэдрэмжтэй урилга (медиа нэмэх)

`/i/[token]` хуудас одоо дараах кино эффектүүдтэй:

- **Ken Burns zoom** — hero видео/зурган дээр аажим томроод шилжих эффект
- **Parallax** — scroll хийхэд hero-гийн силуэт удаан хөдөлнө
- **Word-by-word reveal** — hero гарчиг үг үгээрээ blur-с гарч ирнэ
- **Film grain + vignette** — бүх хуудсан дээр нам дуугаар кино мэдрэмж нэмнэ
- **Дэвсгэр хөгжим** — хаалга нээх мөчид (хэрэглэгчийн эхний товшилтоор,
  browser-ийн autoplay хязгаарлалтыг давж) дуу автоматаар эхэлж, баруун доод
  буланд mute/unmute товч гарч ирнэ

Эдгээр бүгд **`public/media/` фолдерт файл байхгүй үед ч эвдрэхгүй** — зүгээр
л одоогийн CSS дэвсгэр хэвээр харагдана. Жинхэнэ зураг/видео/дуу нэмэхийг
хүсвэл `public/media/README.md`-г үзнэ үү — хүлээгдэж буй файлын нэр,
хэмжээ, мөн AI-аар (Midjourney/GPT Image/Runway/Kling) зураг/видео гаргах
жишээ prompt-уудыг тэнд бичсэн байгаа.

## Local дээр ажиллуулах

1. Хамаарлуудыг суулгах:

   ```bash
   npm install
   ```

2. `.env.example`-г хуулж `.env` болгоод утгуудыг бөглөнө:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — Neon эсвэл Supabase-с авсан Postgres connection string
   - `ADMIN_PASSWORD` — admin-д нэвтрэх нууц үг
   - `ADMIN_SECRET` — санамсаргүй тэмдэгт мөр, жишээ нь: `openssl rand -hex 32`
   - `NEXT_PUBLIC_BASE_URL` — local дээр `http://localhost:3000`

3. Database schema-г push хийх:

   ```bash
   npx prisma db push
   ```

4. Ажиллуулах:

   ```bash
   npm run dev
   ```

5. Нээх:
   - `http://localhost:3000/admin/login` — admin нэвтрэх
   - Нэрсээ нэмээд, үүссэн линкийг зочдод илгээнэ

## Vercel дээр deploy хийх

1. **Postgres бэлдэх** — [Neon](https://neon.tech) эсвэл [Supabase](https://supabase.com) дээр үнэгүй Postgres database үүсгэж, connection string-ийг аваарай (Neon дээр "pooled connection" сонголтыг ашиглахыг зөвлөж байна).

2. **GitHub-д push хийх**:

   ```bash
   git init
   git add .
   git commit -m "init"
   git remote add origin <таны repo>
   git push -u origin main
   ```

3. **Vercel дээр import хийх** — [vercel.com/new](https://vercel.com/new) дээр repo-г холбоод, Environment Variables хэсэгт дараах утгуудыг оруулна:

   - `DATABASE_URL`
   - `ADMIN_PASSWORD`
   - `ADMIN_SECRET`
   - `NEXT_PUBLIC_BASE_URL` → жишээ нь `https://таны-домэйн.vercel.app`

4. Deploy хийсний дараа нэг удаа schema-г push хийнэ (local-с эсвэл Vercel CLI-р):

   ```bash
   npx prisma db push
   ```

5. `https://таны-домэйн.vercel.app/admin/login` руу орж эхэлнэ.

## Хэрхэн ажилладаг

- Admin `/admin` дээр нэр нэмэхэд, сервер тал бүр нэрд санамсаргүй 8 тэмдэгтэй
  token (жишээ нь `af8sj19a`) үүсгэж Postgres-д хадгална.
- Зочин `/i/af8sj19a` линкээ нээхэд, серверээс тухайн token-той таарах нэрийг
  татаж, cinematic урилгын хуудсанд render хийж өгнө (хаалга → drone hero →
  дугтуй → нэрийн reveal → урилгын үг → хөтөлбөр → gallery → төгсгөл).
- Хэн нэгэн урилгаа нээх бүрд `viewedAt` талбар автоматаар бөглөгдөнө — admin
  хүснэгтэд "Үзсэн / Үзээгүй" гэж харагдана.

## Дараагийн сайжруулалт хийж болох зүйлс

- Hero, section-уудын background-т жинхэнэ зураг/drone видео нэмэх
  (`app/i/[token]/InvitationClient.tsx` дотор `.hero`, `.gallery` хэсгүүд)
- SMS/имэйлээр линк автоматаар илгээх
