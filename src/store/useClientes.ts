import { useEffect, useState } from 'react'
import { Cliente } from '../types'

const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD ? 'https://pagina-red.onrender.com' : 'http://localhost:10000'
).replace(/\/+$/, '')

async function request<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    ...options,
  })
  if (response.status === 401) {
    sessionStorage.removeItem('semtec_token')
    window.dispatchEvent(new Event('semtec-logout'))
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || 'No se pudo completar la solicitud')
  }
  return response.json()
}

export function calcDiasMora(ultimoMesPagado: string | null): number {
  if (!ultimoMesPagado) return 0
  const lastDay = new Date(ultimoMesPagado)
  if (Number.isNaN(lastDay.getTime())) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  lastDay.setHours(0, 0, 0, 0)
  const diff = Math.floor((today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff - 1) // days after the paid month ended
}

export function esMoroso(c: Cliente): boolean {
  return c.estado !== 'Cortado' && c.ultimoMesPagado !== null && calcDiasMora(c.ultimoMesPagado) >= 5
}

export function formatMes(dateStr: string | null): string {
  if (!dateStr) return 'Sin registro'
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-HN', { month: 'long', year: 'numeric' })
}

export function useClientes(token: string) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    async function loadClientes() {
      setCargando(true)
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          const loaded = await request<Cliente[]>('/api/clientes', token)
          if (!cancelled) {
            setClientes(loaded)
            setCargando(false)
          }
          return
        } catch (error) {
          if (error instanceof Error && error.message === 'Sesión requerida') return
          if (attempt < 4) {
            await new Promise<void>(resolve => {
              timer = setTimeout(resolve, (attempt + 1) * 1000)
            })
          } else if (!cancelled) {
            console.error('No se pudieron cargar los clientes:', error)
            setCargando(false)
          }
        }
      }
    }

    loadClientes()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [token])

  async function agregarCliente(data: Omit<Cliente, 'id'>) {
    const created = await request<Cliente>('/api/clientes', token, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    setClientes(prev => [...prev, created])
  }

  async function editarCliente(id: number, data: Omit<Cliente, 'id'>) {
    const updated = await request<Cliente>(`/api/clientes/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    setClientes(prev => prev.map(cliente => (cliente.id === id ? updated : cliente)))
  }

  async function darDeBaja(id: number) {
    const updated = await request<Cliente>(`/api/clientes/${id}/baja`, token, { method: 'PATCH' })
    setClientes(prev => prev.map(cliente => (cliente.id === id ? updated : cliente)))
  }

  async function registrarPago(id: number, meses: number, ultimoMesPagado: string) {
    const updated = await request<Cliente>(`/api/clientes/${id}/pagos`, token, {
      method: 'POST',
      body: JSON.stringify({ meses, ultimoMesPagado }),
    })
    setClientes(prev => prev.map(cliente => (cliente.id === id ? updated : cliente)))
  }

  return { clientes, cargando, agregarCliente, editarCliente, darDeBaja, registrarPago }
}
