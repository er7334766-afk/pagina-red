import { useState, useMemo, type FormEvent } from 'react'
import { Cliente } from '../types'
import { formatMes } from '../store/useClientes'
import { X } from './icons'

const OPCIONES_MESES = [1, 2, 3, 6, 12]

interface Props {
  cliente: Cliente
  onClose: () => void
  onSave: (meses: number) => void
}

export default function PagoModal({ cliente, onClose, onSave }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [meses, setMeses] = useState(1)
  const [fecha, setFecha] = useState(today)

  const total = useMemo(() => (cliente.valor ?? 0) * meses, [cliente.valor, meses])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSave(meses)
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
          {/* Meses a pagar */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cantidad de meses a pagar</label>
            <div className="flex gap-2 flex-wrap">
              {OPCIONES_MESES.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMeses(m)}
                  className={`px-4 py-2 rounded-md text-sm font-semibold border transition-colors ${
                    meses === m
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {m === 1 ? '1 mes' : `${m} meses`}
                </button>
              ))}
            </div>
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
