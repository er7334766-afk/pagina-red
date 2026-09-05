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
  await client.query('CREATE UNIQUE INDEX IF NOT EXISTS clientes_ip_unique ON clientes (ip) WHERE ip IS NOT NULL')
  const result = await client.query("DELETE FROM clientes WHERE ip = '10.10.20.1000' RETURNING id_cliente")
  console.log(`Registros eliminados: ${result.rowCount}`)
  console.log('Restriccion de IP unica creada correctamente.')
} catch (error) {
  console.error('No se pudo limpiar el registro:', error.message)
  process.exitCode = 1
} finally {
  await client.end()
}