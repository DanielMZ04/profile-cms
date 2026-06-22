# Profile CMS

Öffentliche Profil- und Beitrags-Website mit verstecktem Admin-Bereich.

## Tech-Stack

- **Next.js 14** (App Router)
- **Prisma** + **SQLite** (einfach auf PostgreSQL wechselbar)
- **NextAuth.js** mit JWT-Sessions und bcrypt-gehashten Passwörtern
- **Tailwind CSS**

## Lokaler Start

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen anlegen

```bash
cp .env.example .env
```

Dann `.env` öffnen und anpassen:

- `NEXTAUTH_SECRET` → langen Zufallsstring eintragen (z. B. `openssl rand -base64 32`)
- `ADMIN_USERNAME` → gewünschter Admin-Benutzername
- `ADMIN_PASSWORD` → gewünschtes Admin-Passwort (wird gehasht in DB gespeichert)

### 3. Datenbank initialisieren

```bash
npm run db:push      # Schema in dev.db schreiben
npm run db:seed      # Ersten Admin-Account anlegen
```

> Nach dem Seed kannst du `ADMIN_PASSWORD` aus der `.env` entfernen — das Passwort liegt nur gehasht in der DB.

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Admin-Bereich

- URL: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Nicht** in der öffentlichen Navigation verlinkt
- Login mit den Daten aus dem Seed-Schritt

## Deployment

### VPS / Railway / Render

```bash
# .env auf dem Server setzen, dann:
npm run build
npm start
```

Das Build-Script pusht automatisch das DB-Schema und generiert den Prisma Client.

### Wechsel zu PostgreSQL

1. `prisma/schema.prisma` ändern:
   ```
   provider = "postgresql"
   ```
2. `DATABASE_URL` auf eine Postgres-URL setzen
3. `npm run db:push` ausführen

### Vercel

Vercel hat ein read-only Dateisystem — SQLite und lokale Bild-Uploads funktionieren dort nicht.
Alternativen:
- Datenbank: Neon, PlanetScale oder Supabase (PostgreSQL)
- Bilder: Cloudinary, Uploadthing oder Vercel Blob

## Sicherheit

| Maßnahme | Umsetzung |
|---|---|
| Passwort-Hashing | bcrypt, 12 Runden |
| Brute-Force-Schutz | Max. 5 Login-Versuche / 10 Min. pro IP |
| Session | JWT, serverseitig geprüft |
| API-Schutz | Jede Admin-Route prüft `getServerSession` |
| Middleware | JWT-Check vor jedem `/admin/*`-Request |
| Input-Sanitization | Zod-Validierung + Null-Byte-Entfernung |
| XSS | React escapet automatisch, kein `dangerouslySetInnerHTML` |
| SQL-Injection | Prisma mit parametrisierten Queries |
