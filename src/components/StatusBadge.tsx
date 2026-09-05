import { Estado } from '../types'

const styles: Record<Estado, string> = {
  'Al dia': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  'En mora': 'bg-red-100 text-red-700 border border-red-200',
  'Cortado': 'bg-slate-100 text-slate-600 border border-slate-200',
}

export default function StatusBadge({ estado }: { estado: Estado }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${styles[estado]}`}>
      {estado === 'En mora' ? 'EN MORA' : estado.toUpperCase()}
    </span>
  )
}
