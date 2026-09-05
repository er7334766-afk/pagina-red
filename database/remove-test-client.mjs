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
  const result = await client.query(
    "DELETE FROM clientes WHERE id_cliente IN (279, 280, 281) OR ip IN ('23894723894', '234890', '283472384') RETURNING id_cliente, ip",
  )
  console.log(`Registros eliminados: ${result.rowCount}`)
  console.log(result.rows)
  console.log('Restriccion de IP unica creada correctamente.')
} catch (error) {
  console.error('No se pudo limpiar el registro:', error.message)
  process.exitCode = 1
} finally {
  await client.end()
}