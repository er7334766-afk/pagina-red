import { AlertTriangle, X } from './icons'

interface Props {
  nombre: string
  onClose: () => void
  onConfirm: () => void
}

export default function BajaModal({ nombre, onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <h2 className="text-base font-semibold text-slate-800">Dar de baja</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
        </div>
        <p className="text-sm text-slate-600 mb-6">
          ¿Está seguro de que desea dar de baja al cliente <span className="font-semibold text-slate-800">{nombre}</span>? El registro se conservará en el sistema con estado "Cortado".
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-md border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Dar de baja
          </button>
        </div>
      </div>
    </div>
  )
}
