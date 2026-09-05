import { LayoutDashboard, Users, X } from './icons'

type Page = 'dashboard' | 'clientes'

interface Props {
  page: Page
  setPage: (p: Page) => void
  open: boolean
  onClose: () => void
}

const NAV: { label: string; page: Page; icon: 'dashboard' | 'users' }[] = [
  { label: 'Dashboard', page: 'dashboard', icon: 'dashboard' },
  { label: 'Clientes', page: 'clientes', icon: 'users' },
]

export default function Sidebar({ page, setPage, open, onClose }: Props) {
  return (
    <>
      {open && <button aria-label="Cerrar menu" className="fixed inset-0 z-30 bg-slate-950/45 md:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-56 shrink-0 bg-slate-800 flex flex-col h-full transition-transform duration-200 md:static md:z-auto md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="px-5 py-5 border-b border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-white font-semibold tracking-wide text-base">SEMTEC</span>
            <p className="text-slate-400 text-xs mt-0.5">Panel de control</p>
          </div>
          <button aria-label="Cerrar menu" onClick={onClose} className="text-slate-400 hover:text-white md:hidden">
            <X size={18} />
          </button>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ label, page: p, icon }) => (
          <button
            key={p}
            onClick={() => { setPage(p); onClose() }}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
              page === p
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {icon === 'dashboard' ? <LayoutDashboard size={16} /> : <Users size={16} />}
            {label}
          </button>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-slate-700">
        <p className="text-slate-500 text-xs">v1.0 · {new Date().getFullYear()}</p>
      </div>
      </aside>
    </>
  )
}
