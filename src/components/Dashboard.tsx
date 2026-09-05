import { useState, useCallback, type ReactNode } from 'react'
import { Users, Wifi, AlertCircle, WifiOff } from './icons'
import { Cliente } from '../types'
import { calcDiasMora, esMoroso, formatMes } from '../store/useClientes'
import StatusBadge from './StatusBadge'
import PagoModal from './PagoModal'
import Toast from './Toast'

const MOROSOS_POR_PAGINA = 50

interface Props {
  clientes: Cliente[]
  onRegistrarPago: (id: number, meses: number) => void
}

export default function Dashboard({ clientes, onRegistrarPago }: Props) {
  const [pagoCliente, setPagoCliente] = useState<Cliente | null>(null)
  const [toast, setToast] = useState('')
  const [pagina, setPagina] = useState(1)

  const total = clientes.length
  const activos = clientes.filter(c => c.estado === 'Al dia').length
  const enMora = clientes.filter(c => esMoroso(c)).length
  const cortados = clientes.filter(c => c.estado === 'Cortado').length

  const morosos = clientes.filter(esMoroso)
  const totalPaginas = Math.max(1, Math.ceil(morosos.length / MOROSOS_POR_PAGINA))
  const morososPagina = morosos.slice((pagina - 1) * MOROSOS_POR_PAGINA, pagina * MOROSOS_POR_PAGINA)

  const handlePago = useCallback((meses: number) => {
    if (!pagoCliente) return
    onRegistrarPago(pagoCliente.id, meses)
    setPagoCliente(null)
    setToast('Pago registrado correctamente')
  }, [pagoCliente, onRegistrarPago])

  const closeToast = useCallback(() => setToast(''), [])

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Resumen del estado de la red</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard icon={<Users size={18} className="text-blue-600" />} label="Total clientes" value={total} color="blue" />
          <KpiCard icon={<Wifi size={18} className="text-emerald-600" />} label="Al dia" value={activos} color="emerald" />
          <KpiCard icon={<AlertCircle size={18} className="text-red-600" />} label="En mora" value={enMora} color="red" />
          <KpiCard icon={<WifiOff size={18} className="text-slate-500" />} label="Cortados" value={cortados} color="slate" />
        </div>

        {/* Mora table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Clientes en mora</h2>
              <p className="text-xs text-slate-400 mt-0.5">{morosos.length} cliente{morosos.length !== 1 ? 's' : ''} con 5 o más días de retraso</p>
            </div>
            {enMora > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {enMora} en mora
              </span>
            )}
          </div>
          {morosos.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Wifi size={32} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No hay clientes en mora</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Abonado', 'Plan', 'Valor', 'IP', 'Último mes pagado', 'Días de mora', 'Estado', 'Acción'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {morososPagina.map((c, i) => {
                    const dias = calcDiasMora(c.ultimoMesPagado)
                    return (
                      <tr key={c.id} className={`hover:bg-slate-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                        <td className="px-4 py-3 font-medium text-slate-800">{c.abonado}</td>
                        <td className="px-4 py-3 text-slate-600">{c.plan}</td>
                        <td className="px-4 py-3 text-slate-700 font-mono">{c.valor === null ? 'Sin registro' : `L ${c.valor.toLocaleString()}`}</td>
                        <td className="px-4 py-3 font-mono text-slate-500 text-xs">{c.ip}</td>
                        <td className="px-4 py-3 text-slate-600 capitalize">{formatMes(c.ultimoMesPagado)}</td>
                        <td className="px-4 py-3">
                          <span className={`font-mono font-semibold ${dias >= 30 ? 'text-red-700' : 'text-orange-600'}`}>{dias}d</span>
                        </td>
                        <td className="px-4 py-3"><StatusBadge estado="En mora" /></td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setPagoCliente(c)}
                            className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
                          >
                            Registrar pago
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          {morosos.length > 0 && (
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-3 text-xs text-slate-500">
              <span>Mostrando hasta 50 de {morosos.length} clientes</span>
              <div className="flex items-center gap-2">
                <button type="button" disabled={pagina === 1} onClick={() => setPagina(value => value - 1)} className="rounded border border-slate-200 bg-white px-3 py-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50">Anterior</button>
                <span className="min-w-20 text-center">Página {pagina} de {totalPaginas}</span>
                <button type="button" disabled={pagina === totalPaginas} onClick={() => setPagina(value => value + 1)} className="rounded border border-slate-200 bg-white px-3 py-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50">Siguiente</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {pagoCliente && (
        <PagoModal
          cliente={pagoCliente}
          onClose={() => setPagoCliente(null)}
          onSave={handlePago}
        />
      )}
      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  )
}

function KpiCard({ icon, label, value, color }: { icon: ReactNode; label: string; value: number; color: string }) {
  const bg: Record<string, string> = {
    blue: 'bg-blue-50',
    emerald: 'bg-emerald-50',
    red: 'bg-red-50',
    slate: 'bg-slate-50',
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-5 py-4">
      <div className={`w-9 h-9 rounded-lg ${bg[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-800 font-mono">{value}</p>
      <p className="text-xs font-medium text-slate-500 mt-0.5 uppercase tracking-wide">{label}</p>
    </div>
  )
}
