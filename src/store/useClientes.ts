import { useEffect, useState } from 'react'
import { Cliente } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
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

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])

  useEffect(() => {
    request<Cliente[]>('/api/clientes')
      .then(setClientes)
      .catch(error => console.error('No se pudieron cargar los clientes:', error))
  }, [])

  async function agregarCliente(data: Omit<Cliente, 'id'>) {
    const created = await request<Cliente>('/api/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    setClientes(prev => [...prev, created])
  }

  async function editarCliente(id: number, data: Omit<Cliente, 'id'>) {
    const updated = await request<Cliente>(`/api/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    setClientes(prev => prev.map(cliente => (cliente.id === id ? updated : cliente)))
  }

  async function darDeBaja(id: number) {
    const updated = await request<Cliente>(`/api/clientes/${id}/baja`, { method: 'PATCH' })
    setClientes(prev => prev.map(cliente => (cliente.id === id ? updated : cliente)))
  }

  async function registrarPago(id: number, meses: number) {
    const updated = await request<Cliente>(`/api/clientes/${id}/pagos`, {
      method: 'POST',
      body: JSON.stringify({ meses }),
    })
    setClientes(prev => prev.map(cliente => (cliente.id === id ? updated : cliente)))
  }

  return { clientes, agregarCliente, editarCliente, darDeBaja, registrarPago }
}
