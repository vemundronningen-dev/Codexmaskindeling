# Maskinoversikt MVP (Next.js + TypeScript + Tailwind + Prisma + Neon)

En enkel og ryddig app for å holde oversikt over maskiner, prosjekter og brukere.

## Hva appen inneholder

- Innlogging (e-post + passord)
- Roller: **Admin** og **Bruker**
- Oversikt over:
  - Prosjekter
  - Maskiner
  - Brukere
- Maskinstatus:
  - Ledig
  - Tildelt
  - Service
  - Ute av drift
- Admin kan tildele ansvarlig bruker/prosjekt og oppdatere status
- Egen side for **ledige maskiner**
- Visning av maskiner i:
  - Tabell
  - Enkel kanban
- Norsk UI
- Seed-data for rask oppstart

---

## 1) Oppsett av Neon Postgres

1. Gå til [neon.tech](https://neon.tech) og opprett konto.
2. Opprett et nytt prosjekt.
3. Inne i prosjektet: kopier connection string (Postgres URL).
4. Sørg for at URL-en inkluderer SSL, typisk `?sslmode=require`.

Eksempel:

```env
DATABASE_URL="postgresql://bruker:passord@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

---

## 2) Lokal oppstart av appen

```bash
npm install
cp .env.example .env
```

Legg inn din Neon-URL i `.env`.

### Kjør Prisma migrering + generering

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Seed demo-data

```bash
npm run prisma:seed
```

### Start utviklingsserver

```bash
npm run dev
```

Åpne: `http://localhost:3000`

---

## 3) Demo-brukere fra seed

- **Admin**
  - E-post: `admin@maskin.no`
  - Passord: `admin123`
- **Bruker**
  - E-post: `bruker@maskin.no`
  - Passord: `bruker123`

Nye brukere som opprettes i UI får standardpassord: `bruker123` (MVP-forenkling).

---

## 4) Deploy til Vercel

1. Push prosjektet til GitHub.
2. Gå til [vercel.com](https://vercel.com) → **New Project**.
3. Importer repo.
4. Legg til miljøvariabel i Vercel:
   - `DATABASE_URL` = Neon connection string.
5. Deploy.

### Viktig for Prisma på Vercel

- Sørg for at `prisma generate` kjøres ved build (det håndteres av Next/Prisma-oppsettet her).
- Kjør migrering mot produksjonsdatabase før/ved første deploy:

```bash
npx prisma migrate deploy
```

Du kan gjøre dette via CI eller manuelt lokalt mot samme `DATABASE_URL`.

---

## Struktur (enkel oversikt)

- `app/(auth)/login/page.tsx` – innlogging
- `app/(dashboard)/machines/page.tsx` – maskiner + tabell/kanban
- `app/(dashboard)/machines/available/page.tsx` – ledige maskiner
- `app/(dashboard)/projects/page.tsx` – prosjektoversikt
- `app/(dashboard)/users/page.tsx` – brukeroversikt
- `app/(dashboard)/actions.ts` – server actions (admin-endringer)
- `prisma/schema.prisma` – datamodeller
- `prisma/seed.ts` – seed-data

---

## Prisma-modeller

- `User`
- `Project`
- `Machine`

Disse matcher ønsket MVP-oppsett.

---

## MVP-notat (bevisst enkelhet)

For å holde løsningen lett forståelig for en no-code bruker:

- Enkel cookie-basert session
- Enkel innlogging med seed-passord
- Fokus på tydelig og kort kode

Ved neste steg kan du legge til:

- Sikrere sessions (f.eks. NextAuth/Auth.js)
- Endring av passord i UI
- Validering og feilhåndtering per felt
- Filtrering/søk/paginering
