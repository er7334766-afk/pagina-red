import { readFile, writeFile } from 'node:fs/promises'

const sourcePath = process.argv[2] || 'C:/Users/erodr/Downloads/tabla.txt'
const outputPath = new URL('./import-clientes.sql', import.meta.url)
const source = await readFile(sourcePath, 'utf8')
const rows = source.trimEnd().split(/\r?\n/).slice(1).map(line => line.split('\t'))

function sqlText(value) {
  const normalized = value?.trim()
  if (!normalized || normalized.toLowerCase() === 'null') return 'NULL'
  return `'${normalized.replaceAll("'", "''")}'`
}

function sqlDate(value) {
  const normalized = value?.trim()
  if (!normalized || normalized.toLowerCase() === 'null') return 'NULL'
  const match = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!match) return 'NULL'
  const [, day, month, year] = match
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) return 'NULL'
  return `'${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}'`
}

function sqlNumber(value) {
  const normalized = value?.trim()
  return normalized && normalized.toLowerCase() !== 'null' && /^\d+(\.\d+)?$/.test(normalized)
    ? normalized
    : 'NULL'
}

const inserts = rows.map(columns => {
  const [fecha, abonado, plan, valor, ip, ultimoMesPagado] = columns
  const marker = ultimoMesPagado?.trim().toLowerCase()
  const estado = marker === 'cortado' || marker === 'se retiro' ? '3' : 'NULL'
  const lastPaid = estado === '3' ? 'NULL' : sqlDate(ultimoMesPagado)

  return `INSERT INTO clientes (fecha_conexion, abonado, plan, valor, ip, ultimo_mes_pagado, id_estado) VALUES (${sqlDate(fecha)}, ${sqlText(abonado)}, ${sqlText(plan)}, ${sqlNumber(valor)}, ${sqlText(ip)}, ${lastPaid}, ${estado});`
})

const sql = [
  'BEGIN;',
  '',
  '-- Generated from tabla.txt. Blank or invalid source values are imported as NULL.',
  `-- Source records: ${rows.length}`,
  '',
  ...inserts,
  '',
  'COMMIT;',
  '',
].join('\n')

await writeFile(outputPath, sql, 'utf8')

const connectionDates = rows.filter(row => sqlDate(row[0]) !== 'NULL').length
const paidDates = rows.filter(row => {
  const marker = row[5]?.trim().toLowerCase()
  return marker !== 'cortado' && marker !== 'se retiro' && sqlDate(row[5]) !== 'NULL'
}).length
const cutRows = rows.filter(row => ['cortado', 'se retiro'].includes(row[5]?.trim().toLowerCase())).length

console.log(`Generated ${rows.length} INSERT statements`)
console.log(`Connection dates: ${connectionDates}`)
console.log(`Last-paid dates: ${paidDates}`)
console.log(`Cortado rows: ${cutRows}`)
