import cors from 'cors'
import express from 'express'
import { Pool } from 'pg'

const app = express()
const port = Number(process.env.PORT || 10000)
const allowedOrigin = process.env.FRONTEND_URL || '*'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
})

app.use(cors({ origin: allowedOrigin }))
app.use(express.json())

app.get('/', (_request, response) => {
  response.json({ service: 'pagina-red-api', status: 'ok' })
})

function nullable(value) {
  return value === '' || value === undefined ? null : value
}

function normalizePlan(value) {
  const plan = nullable(value)
  if (plan === null) return null
  const normalized = String(plan).trim()
  return /^\d+(\.\d+)?$/.test(normalized) ? `${normalized}mg` : normalized
}

function dateOnly(value) {
  if (!value) return null
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).split('T')[0]
}

function effectiveStatus(status, lastPaid) {
  if (status === 'Cortado') return 'Cortado'
  if (!lastPaid) return status
  const daysLate = Math.floor((Date.now() - new Date(`${lastPaid}T00:00:00`).getTime()) / 86400000) - 1
  return daysLate >= 5 ? 'En mora' : 'Al dia'
}

function mapCliente(row) {
  const lastPaid = dateOnly(row.ultimoMesPagado)
  return {
    id: row.id,
    fechaConexion: dateOnly(row.fechaConexion),
    abonado: row.abonado,
    plan: normalizePlan(row.plan),
    valor: row.valor === null ? null : Number(row.valor),
    ip: row.ip,
    ultimoMesPagado: lastPaid,
    estado: effectiveStatus(row.estado, lastPaid),
  }
}

const clienteSelect = `
  SELECT
    c.id_cliente AS id,
    c.fecha_conexion AS "fechaConexion",
    c.abonado,
    c.plan,
    c.valor,
    c.ip,
    c.ultimo_mes_pagado AS "ultimoMesPagado",
    e.nombre AS estado
  FROM clientes c
  LEFT JOIN estados e ON e.id_estado = c.id_estado
`

app.get('/health', async (_request, response) => {
  const result = await pool.query('SELECT 1 AS ok')
  response.json({ ok: result.rows[0].ok === 1 })
})

app.get('/api/estados', async (_request, response) => {
  const result = await pool.query('SELECT id_estado AS id, nombre FROM estados ORDER BY id_estado')
  response.json(result.rows)
})

app.get('/api/clientes', async (_request, response) => {
  const result = await pool.query(`${clienteSelect} ORDER BY c.id_cliente`)
  response.json(result.rows.map(mapCliente))
})

app.post('/api/clientes', async (request, response) => {
  const { fechaConexion, abonado, plan, valor, ip, ultimoMesPagado, estado } = request.body
  const result = await pool.query(
    `INSERT INTO clientes
      (fecha_conexion, abonado, plan, valor, ip, ultimo_mes_pagado, id_estado)
     VALUES ($1, $2, $3, $4, $5, $6, (SELECT id_estado FROM estados WHERE nombre = $7))
     RETURNING id_cliente`,
    [nullable(fechaConexion), nullable(abonado), normalizePlan(plan), nullable(valor), nullable(ip), nullable(ultimoMesPagado), nullable(estado)],
  )
  const created = await pool.query(`${clienteSelect} WHERE c.id_cliente = $1`, [result.rows[0].id_cliente])
  response.status(201).json(mapCliente(created.rows[0]))
})

app.put('/api/clientes/:id', async (request, response) => {
  const { fechaConexion, abonado, plan, valor, ip, ultimoMesPagado, estado } = request.body
  const result = await pool.query(
    `UPDATE clientes
     SET fecha_conexion = $1,
         abonado = $2,
         plan = $3,
         valor = $4,
         ip = $5,
         ultimo_mes_pagado = $6,
         id_estado = (SELECT id_estado FROM estados WHERE nombre = $7)
     WHERE id_cliente = $8
     RETURNING id_cliente`,
    [nullable(fechaConexion), nullable(abonado), normalizePlan(plan), nullable(valor), nullable(ip), nullable(ultimoMesPagado), nullable(estado), request.params.id],
  )
  if (result.rowCount === 0) return response.status(404).json({ error: 'Cliente no encontrado' })
  const updated = await pool.query(`${clienteSelect} WHERE c.id_cliente = $1`, [request.params.id])
  response.json(mapCliente(updated.rows[0]))
})

app.patch('/api/clientes/:id/baja', async (request, response) => {
  const result = await pool.query(
    `UPDATE clientes
     SET id_estado = (SELECT id_estado FROM estados WHERE nombre = 'Cortado')
     WHERE id_cliente = $1
     RETURNING id_cliente`,
    [request.params.id],
  )
  if (result.rowCount === 0) return response.status(404).json({ error: 'Cliente no encontrado' })
  const updated = await pool.query(`${clienteSelect} WHERE c.id_cliente = $1`, [request.params.id])
  response.json(mapCliente(updated.rows[0]))
})

app.post('/api/clientes/:id/pagos', async (request, response) => {
  const meses = Number(request.body.meses)
  const ultimoMesPagado = request.body.ultimoMesPagado
  if (!Number.isInteger(meses) || meses < 1 || !/^\d{4}-\d{2}-01$/.test(ultimoMesPagado || '')) {
    return response.status(400).json({ error: 'La cantidad de meses debe ser un entero positivo' })
  }

  const result = await pool.query(
    `UPDATE clientes AS c
     SET ultimo_mes_pagado = (date_trunc('month', $2::date) + interval '1 month' - interval '1 day')::date,
         id_estado = CASE
           WHEN c.id_estado = (SELECT id_estado FROM estados WHERE nombre = 'Cortado') THEN c.id_estado
           WHEN CURRENT_DATE - (date_trunc('month', $2::date) + interval '1 month' - interval '1 day')::date >= 6 THEN (SELECT id_estado FROM estados WHERE nombre = 'En mora')
           ELSE (SELECT id_estado FROM estados WHERE nombre = 'Al dia')
         END
     WHERE c.id_cliente = $1
     RETURNING c.id_cliente`,
    [request.params.id, ultimoMesPagado],
  )
  if (result.rowCount === 0) {
    return response.status(400).json({ error: 'El cliente no existe o no tiene último mes pagado para calcular el pago' })
  }
  const updated = await pool.query(`${clienteSelect} WHERE c.id_cliente = $1`, [request.params.id])
  response.json(mapCliente(updated.rows[0]))
})

app.use((error, _request, response, _next) => {
  console.error(error)
  if (error.code === '23505' && error.constraint === 'clientes_ip_unique') {
    return response.status(409).json({ error: 'Ya existe un cliente con esa IP' })
  }
  response.status(500).json({ error: 'Error interno del servidor' })
})

async function start() {
  await pool.query("UPDATE estados SET nombre = 'Al dia' WHERE id_estado = 1 AND nombre = 'Activo'")
  await pool.query("UPDATE clientes SET plan = plan || 'mg' WHERE plan ~ '^\\d+(\\.\\d+)?$'")
  await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS clientes_ip_unique ON clientes (ip) WHERE ip IS NOT NULL')
  app.listen(port, () => {
    console.log(`API escuchando en el puerto ${port}`)
  })
}

start().catch(error => {
  console.error('No se pudo iniciar la API:', error)
  process.exit(1)
})
