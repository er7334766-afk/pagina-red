import { useState, useCallback } from 'react'
import { useClientes } from './store/useClientes'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Clientes from './components/Clientes'
import { Menu } from './components/icons'

type Page = 'dashboard' | 'clientes'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const { clientes, agregarCliente, editarCliente, darDeBaja, registrarPago } = useClientes()

  const handleRegistrarPago = useCallback((id: number, meses: number) => {
    registrarPago(id, meses)
  }, [registrarPago])

  return (
    <div className="size-full flex bg-slate-100">
      <Sidebar page={page} setPage={setPage} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex-1 flex overflow-hidden">
        <button
          aria-label="Abrir menu"
          onClick={() => setMenuOpen(true)}
          className="absolute left-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm md:hidden"
        >
          <Menu size={20} />
        </button>
        {page === 'dashboard' ? (
          <Dashboard clientes={clientes} onRegistrarPago={handleRegistrarPago} />
        ) : (
          <Clientes
            clientes={clientes}
            onAgregar={agregarCliente}
            onEditar={editarCliente}
            onDarDeBaja={darDeBaja}
            onRegistrarPago={handleRegistrarPago}
          />
        )}
      </main>
    </div>
  )
}
