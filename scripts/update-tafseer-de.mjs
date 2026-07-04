/**
 * Schreibt die deutschen Übersetzungen aus scripts/tafseer-de.json
 * in die Spalte text_de der Tabelle tafseer_asadi.
 * Ausführen: node scripts/update-tafseer-de.mjs
 */
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const prisma = new PrismaClient()
const INPUT = join(dirname(fileURLToPath(import.meta.url)), 'tafseer-de.json')

async function main() {
  const raw = JSON.parse(readFileSync(INPUT, 'utf8'))
  const entries = Object.entries(raw)
  console.log(`Aktualisiere ${entries.length} deutsche Übersetzungen …`)
  let ok = 0
  for (const [verseKey, textDe] of entries) {
    try {
      await prisma.tafseerAsadi.update({ where: { verseKey }, data: { textDe } })
      ok++
    } catch {
      console.warn(`  Übersprungen (nicht in DB): ${verseKey}`)
    }
  }
  console.log(`Fertig: ${ok}/${entries.length} aktualisiert.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
