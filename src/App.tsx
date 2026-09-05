import { useState, useCallback } from 'react'
import { useClientes } from './store/useClientes'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Clientes from './components/Clientes'

type Page = 'dashboard' | 'clientes'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const { clientes, agregarCliente, editarCliente, darDeBaja, registrarPago } = useClientes()

  const handleRegistrarPago = useCallback((id: number, meses: number) => {
    registrarPago(id, meses)
  }, [registrarPago])

  return (
    <div className="size-full flex bg-slate-100">
      <Sidebar page={page} setPage={setPage} />
      <main className="flex-1 flex overflow-hidden">
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
