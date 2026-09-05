export type Estado = 'Al dia' | 'En mora' | 'Cortado'

export interface Cliente {
  id: number
  fechaConexion: string | null
  abonado: string | null
  plan: string | null
  valor: number | null
  ip: string | null
  ultimoMesPagado: string | null
  estado: Estado | null
}
