import { useState, useCallback, useMemo, type ReactNode } from 'react'
import { Search, Plus, Pencil, CreditCard, UserX } from './icons'
import { Cliente, Estado } from '../types'
import { formatMes, esMoroso } from '../store/useClientes'
import StatusBadge from './StatusBadge'
import ClienteModal from './ClienteModal'
import PagoModal from './PagoModal'
import BajaModal from './BajaModal'
import Toast from './Toast'

interface Props {
  clientes: Cliente[]
  onAgregar: (data: Omit<Cliente, 'id'>) => void
  onEditar: (id: number, data: Omit<Cliente, 'id'>) => void
  onDarDeBaja: (id: number) => void
  onRegistrarPago: (id: number, meses: number) => void
}

type FiltroEstado = 'Todos' | Estado

export default function Clientes({ clientes, onAgregar, onEditar, onDarDeBaja, onRegistrarPago }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState<FiltroEstado>('Todos')
  const [editCliente, setEditCliente] = useState<Cliente | null | 'nuevo'>(null)
  const [pagoCliente, setPagoCliente] = useState<Cliente | null>(null)
  const [bajaCliente, setBajaCliente] = useState<Cliente | null>(null)
  const [toast, setToast] = useState('')

  const filtered = useMemo(() => {
    return clientes.filter(c => {
      const matchBusq = busqueda === '' ||
        c.abonado?.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.ip?.includes(busqueda) ||
        c.plan?.toLowerCase().includes(busqueda.toLowerCase())
      const estadoEfectivo: Estado | null = esMoroso(c) ? 'En mora' : c.estado
      const matchFiltro = filtro === 'Todos' || estadoEfectivo === filtro
      return matchBusq && matchFiltro
    })
  }, [clientes, busqueda, filtro])

  const handleSaveCliente = useCallback((data: Omit<Cliente, 'id'>) => {
    if (editCliente === 'nuevo') {
      onAgregar(data)
      setToast('Cliente creado correctamente')
    } else if (editCliente) {
      onEditar(editCliente.id, data)
      setToast('Cliente actualizado correctamente')
    }
    setEditCliente(null)
  }, [editCliente, onAgregar, onEditar])

  const handlePago = useCallback((meses: number) => {
    if (!pagoCliente) return
    onRegistrarPago(pagoCliente.id, meses)
    setPagoCliente(null)
    setToast('Pago registrado correctamente')
  }, [pagoCliente, onRegistrarPago])

  const handleBaja = useCallback(() => {
    if (!bajaCliente) return
    onDarDeBaja(bajaCliente.id)
    setBajaCliente(null)
    setToast(`${bajaCliente.abonado} fue dado de baja`)
  }, [bajaCliente, onDarDeBaja])

  const closeToast = useCallback(() => setToast(''), [])

  const FILTROS: FiltroEstado[] = ['Todos', 'Al dia', 'En mora', 'Cortado']

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">Clientes</h1>
          <p className="text-slate-500 text-sm mt-0.5">{clientes.length} abonados registrados</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, IP o plan..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-1.5">
            {FILTROS.map(f => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                  filtro === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => setEditCliente('nuevo')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus size={15} />
            Nuevo cliente
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['#', 'Fecha', 'Abonado', 'Plan', 'Valor', 'IP', 'Último mes pagado', 'Estado', 'Acciones'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">
                      No se encontraron clientes
                    </td>
                  </tr>
                ) : filtered.map((c, i) => {
                  const estadoEfectivo: Estado | null = esMoroso(c) ? 'En mora' : c.estado
                  return (
                    <tr key={c.id} className={`hover:bg-slate-50/60 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}>
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">{c.id}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {c.fechaConexion ? new Date(c.fechaConexion + 'T12:00:00').toLocaleDateString('es-HN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Sin registro'}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{c.abonado}</td>
                      <td className="px-4 py-3 text-slate-600">{c.plan}</td>
                      <td className="px-4 py-3 text-slate-700 font-mono whitespace-nowrap">{c.valor === null ? 'Sin registro' : `L ${c.valor.toLocaleString()}`}</td>
                      <td className="px-4 py-3 font-mono text-slate-500 text-xs">{c.ip}</td>
                      <td className="px-4 py-3 text-slate-600 capitalize whitespace-nowrap">{formatMes(c.ultimoMesPagado)}</td>
                      <td className="px-4 py-3">{estadoEfectivo ? <StatusBadge estado={estadoEfectivo} /> : <span className="text-xs text-slate-400">Sin estado</span>}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <ActionBtn
                            icon={<Pencil size={13} />}
                            label="Editar"
                            onClick={() => setEditCliente(c)}
                            variant="default"
                          />
                          <ActionBtn
                            icon={<CreditCard size={13} />}
                            label="Pago"
                            onClick={() => setPagoCliente(c)}
                            variant="blue"
                          />
                          {c.estado !== 'Cortado' && (
                            <ActionBtn
                              icon={<UserX size={13} />}
                              label="Baja"
                              onClick={() => setBajaCliente(c)}
                              variant="red"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editCliente !== null && (
        <ClienteModal
          cliente={editCliente === 'nuevo' ? undefined : editCliente}
          onClose={() => setEditCliente(null)}
          onSave={handleSaveCliente}
        />
      )}
      {pagoCliente && (
        <PagoModal
          cliente={pagoCliente}
          onClose={() => setPagoCliente(null)}
          onSave={handlePago}
        />
      )}
      {bajaCliente && (
        <BajaModal
          nombre={bajaCliente.abonado ?? 'Sin nombre'}
          onClose={() => setBajaCliente(null)}
          onConfirm={handleBaja}
        />
      )}
      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  )
}

function ActionBtn({ icon, label, onClick, variant }: {
  icon: ReactNode
  label: string
  onClick: () => void
  variant: 'default' | 'blue' | 'red'
}) {
  const cls = {
    default: 'border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50',
    blue: 'border border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50',
    red: 'border border-red-200 text-red-600 hover:border-red-400 hover:bg-red-50',
  }[variant]
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${cls}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
