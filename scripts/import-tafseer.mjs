/**
 * Importiert scripts/tafseer-asadi.json in die Tabelle tafseer_asadi (via Prisma).
 * Vorher ausführen: npx prisma db push && npx prisma generate
 * Dann: node scripts/import-tafseer.mjs
 */
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const prisma = new PrismaClient()
const INPUT = join(dirname(fileURLToPath(import.meta.url)), 'tafseer-asadi.json')
const BATCH = 250

async function main() {
  const raw = JSON.parse(readFileSync(INPUT, 'utf8'))
  const entries = Object.entries(raw).map(([verseKey, textAr]) => ({ verseKey, textAr }))
  console.log(`Importiere ${entries.length} Verse in Batches à ${BATCH} …`)

  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH)
    await prisma.$transaction(
      batch.map(e =>
        prisma.tafseerAsadi.upsert({
          where: { verseKey: e.verseKey },
          update: { textAr: e.textAr },
          create: e,
        })
      )
    )
    console.log(`  ${Math.min(i + BATCH, entries.length)}/${entries.length}`)
  }
  console.log('Fertig.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
