import { useState, type FormEvent } from 'react'

interface Props {
  apiUrl: string
  onLogin: (token: string) => void
}

export default function Login({ apiUrl, onLogin }: Props) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'No se pudo iniciar sesión')
      onLogin(body.token)
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-full flex items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-7 shadow-lg">
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">SEMTEC</p>
          <h1 className="mt-2 text-xl font-semibold text-slate-800">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-slate-500">Acceso al panel de control</p>
        </div>
        <label className="mb-4 block text-sm font-medium text-slate-700">
          Usuario
          <input value={usuario} onChange={event => setUsuario(event.target.value)} required autoComplete="username" className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        <label className="mb-5 block text-sm font-medium text-slate-700">
          Contraseña
          <input type="password" value={password} onChange={event => setPassword(event.target.value)} required autoComplete="current-password" className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        {error && <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </main>
  )
}
