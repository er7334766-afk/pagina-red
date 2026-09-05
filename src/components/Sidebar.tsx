import { LayoutDashboard, Users } from './icons'

type Page = 'dashboard' | 'clientes'

interface Props {
  page: Page
  setPage: (p: Page) => void
}

const NAV: { label: string; page: Page; icon: 'dashboard' | 'users' }[] = [
  { label: 'Dashboard', page: 'dashboard', icon: 'dashboard' },
  { label: 'Clientes', page: 'clientes', icon: 'users' },
]

export default function Sidebar({ page, setPage }: Props) {
  return (
    <aside className="w-56 shrink-0 bg-slate-800 flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-700">
        <span className="text-white font-semibold tracking-wide text-base">SEMTEC</span>
        <p className="text-slate-400 text-xs mt-0.5">Panel de control</p>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ label, page: p, icon }) => (
          <button
            key={p}
            onClick={() => setPage(p)}
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
  )
}
