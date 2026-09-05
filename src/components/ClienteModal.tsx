import { useState, useEffect, type FormEvent } from 'react'
import { Cliente, Estado } from '../types'
import { X } from './icons'

interface Props {
  cliente?: Cliente
  onClose: () => void
  onSave: (data: Omit<Cliente, 'id'>) => void
}

const today = new Date().toISOString().split('T')[0]

const empty: Omit<Cliente, 'id'> = {
  fechaConexion: today,
  abonado: '',
  plan: '',
  valor: 0,
  ip: '',
  ultimoMesPagado: today,
  estado: 'Al dia',
}

export default function ClienteModal({ cliente, onClose, onSave }: Props) {
  const [form, setForm] = useState<Omit<Cliente, 'id'>>(cliente ? { ...cliente } : { ...empty })

  useEffect(() => {
    setForm(cliente ? { ...cliente } : { ...empty })
  }, [cliente])

  function set<K extends keyof Omit<Cliente, 'id'>>(key: K, val: Omit<Cliente, 'id'>[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSave(form)
  }

  const isEdit = !!cliente

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-slate-800">{isEdit ? 'Editar cliente' : 'Nuevo cliente'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">Fecha de conexión</label>
              <input
                type="date"
                value={form.fechaConexion ?? ''}
                onChange={e => set('fechaConexion', e.target.value)}
                required
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
              <select
                value={form.estado ?? ''}
                onChange={e => set('estado', e.target.value as Estado)}
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Al dia">Al dia</option>
                <option value="En mora">En mora</option>
                <option value="Cortado">Cortado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">Nombre del abonado</label>
            <input
              type="text"
              value={form.abonado ?? ''}
              onChange={e => set('abonado', e.target.value)}
              required
              placeholder="Ej: Juan Pérez"
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">Plan</label>
              <input
                type="text"
                value={form.plan ?? ''}
                onChange={e => set('plan', e.target.value)}
                required
                placeholder="Ej: 30"
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">Valor mensual (L)</label>
              <input
                type="number"
                value={form.valor || ''}
                onChange={e => set('valor', Number(e.target.value))}
                required
                min={0}
                placeholder="500"
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">Dirección IP</label>
            <input
              type="text"
                value={form.ip ?? ''}
              onChange={e => set('ip', e.target.value)}
              required
              placeholder="192.168.1.x"
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">Último mes pagado</label>
            <input
              type="date"
              value={form.ultimoMesPagado ?? ''}
              onChange={e => set('ultimoMesPagado', e.target.value)}
              required
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-400 mt-1">Ingrese el último día del mes pagado (ej: 2026-08-31)</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-md border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Guardar cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
