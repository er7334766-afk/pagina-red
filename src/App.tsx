import { useState, useCallback, useEffect } from 'react'
import { useClientes } from './store/useClientes'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Clientes from './components/Clientes'
import { Menu } from './components/icons'
import Login from './components/Login'

type Page = 'dashboard' | 'clientes'
const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://pagina-red.onrender.com' : 'http://localhost:10000')).replace(/\/+$/, '')

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('semtec_token') || '')
  const [page, setPage] = useState<Page>('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const { clientes, cargando, agregarCliente, editarCliente, darDeBaja, registrarPago } = useClientes(token)
  const handleRegistrarPago = useCallback((id: number, meses: number, ultimoMesPagado: string) => {
    return registrarPago(id, meses, ultimoMesPagado)
  }, [registrarPago])

  useEffect(() => {
    const handleLogout = () => setToken('')
    window.addEventListener('semtec-logout', handleLogout)
    return () => window.removeEventListener('semtec-logout', handleLogout)
  }, [])

  if (!token) {
    return <Login apiUrl={API_URL} onLogin={value => { sessionStorage.setItem('semtec_token', value); setToken(value) }} />
  }

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
          <Dashboard clientes={clientes} cargando={cargando} onRegistrarPago={handleRegistrarPago} />
        ) : (
          <Clientes
            clientes={clientes}
            cargando={cargando}
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
