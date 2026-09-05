import { useState, useMemo, type FormEvent } from 'react'
import { Cliente } from '../types'
import { formatMes } from '../store/useClientes'
import { X } from './icons'

interface Props {
  cliente: Cliente
  onClose: () => void
  onSave: (meses: number, ultimoMesPagado: string) => void
}

function mesesPendientes(ultimoMesPagado: string | null): { value: string; label: string }[] {
  const base = ultimoMesPagado ? new Date(`${ultimoMesPagado}T12:00:00`) : new Date()
  const startMonth = ultimoMesPagado ? base.getMonth() + 1 : base.getMonth()
  const year = base.getFullYear()
  const result: { value: string; label: string }[] = []

  for (let month = startMonth; month < 12; month += 1) {
    const date = new Date(year, month, 1)
    result.push({
      value: `${year}-${String(month + 1).padStart(2, '0')}-01`,
      label: date.toLocaleDateString('es-HN', { month: 'long' }),
    })
  }
  return result
}

export default function PagoModal({ cliente, onClose, onSave }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const opcionesMeses = useMemo(() => mesesPendientes(cliente.ultimoMesPagado), [cliente.ultimoMesPagado])
  const [mesesSeleccionados, setMesesSeleccionados] = useState<string[]>(() => opcionesMeses.slice(0, 1).map(mes => mes.value))
  const [fecha, setFecha] = useState(today)

  const total = useMemo(() => (cliente.valor ?? 0) * mesesSeleccionados.length, [cliente.valor, mesesSeleccionados.length])

  function toggleMes(value: string) {
    const index = opcionesMeses.findIndex(mes => mes.value === value)
    if (index < 0) return

    setMesesSeleccionados(current => {
      const selectedIndex = current.indexOf(value)
      if (selectedIndex >= 0) return current.slice(0, selectedIndex)
      if (index !== current.length) return current
      return [...current, value]
    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const ultimoMesPagado = mesesSeleccionados.at(-1)
    if (!ultimoMesPagado) return
    onSave(mesesSeleccionados.length, ultimoMesPagado)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Registrar pago</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
        </div>

        {/* Client info */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Abonado</p>
            <p className="text-slate-800 font-medium mt-0.5">{cliente.abonado}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Plan</p>
            <p className="text-slate-800 font-medium mt-0.5">{cliente.plan}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Valor mensual</p>
            <p className="text-slate-800 font-medium mt-0.5">{cliente.valor === null ? 'Sin registro' : `L ${cliente.valor.toLocaleString()}`}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Último mes pagado</p>
            <p className="text-slate-800 font-medium mt-0.5 capitalize">{formatMes(cliente.ultimoMesPagado)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Meses concretos a pagar */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Meses a pagar</label>
            <div className="flex gap-2 flex-wrap">
              {opcionesMeses.map((mes, index) => (
                <button
                  key={mes.value}
                  type="button"
                  onClick={() => toggleMes(mes.value)}
                  disabled={!mesesSeleccionados.includes(mes.value) && index !== mesesSeleccionados.length}
                  className={`px-4 py-2 rounded-md text-sm font-semibold border transition-colors ${
                    mesesSeleccionados.includes(mes.value)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600'
                  }`}
                >
                  {mes.label}
                </button>
              ))}
            </div>
            {opcionesMeses.length === 0 && <p className="text-xs text-slate-400">No hay meses pendientes para seleccionar.</p>}
            <p className="text-xs text-slate-400 mt-2">Seleccionados: {mesesSeleccionados.length}</p>
          </div>

          {/* Fecha del pago */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha del pago</label>
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Total */}
          <div className="bg-blue-50 rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Monto total</span>
            <span className="text-xl font-bold text-blue-700 font-mono">L {total.toLocaleString()}</span>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-md border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mesesSeleccionados.length === 0}
              className="flex-1 px-4 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Registrar pago
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
