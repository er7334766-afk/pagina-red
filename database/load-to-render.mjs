import { readFile } from 'node:fs/promises'
import { Client } from 'pg'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('Falta la variable de entorno DATABASE_URL.')
  process.exit(1)
}

const client = new Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
})

try {
  await client.connect()
  const schemaSql = await readFile(new URL('./schema.sql', import.meta.url), 'utf8')
  const importSql = await readFile(new URL('./import-clientes.sql', import.meta.url), 'utf8')
  const normalizedImportSql = importSql.replace(/^\uFEFF/, '')
  const insertSql = normalizedImportSql.replace(/^BEGIN;\s*/i, '').replace(/\s*COMMIT;\s*$/i, '')

  await client.query('BEGIN')
  await client.query(schemaSql)
  await client.query('TRUNCATE TABLE clientes RESTART IDENTITY')
  await client.query(insertSql)
  await client.query('COMMIT')
  console.log('Esquema y clientes cargados correctamente en Render.')
} catch (error) {
  await client.query('ROLLBACK').catch(() => {})
  console.error('No se pudo completar la carga:', error.message)
  process.exitCode = 1
} finally {
  await client.end()
}
