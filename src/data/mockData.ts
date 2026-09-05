import { Cliente } from '../types'

// Today: 2026-09-04
// ultimoMesPagado is the last day of the last paid month
export const clientesIniciales: Cliente[] = [
  {
    id: 1,
    fechaConexion: '2026-01-10',
    abonado: 'Juan Pérez',
    plan: '20 Mbps',
    valor: 500,
    ip: '192.168.1.20',
    ultimoMesPagado: '2026-08-31', // paid through August → current, no mora
    estado: 'Activo',
  },
  {
    id: 2,
    fechaConexion: '2026-02-15',
    abonado: 'María López',
    plan: '30 Mbps',
    valor: 600,
    ip: '192.168.1.21',
    ultimoMesPagado: '2026-07-31', // paid through July → 35 days mora
    estado: 'En mora',
  },
  {
    id: 3,
    fechaConexion: '2026-03-20',
    abonado: 'Carlos Díaz',
    plan: '50 Mbps',
    valor: 800,
    ip: '192.168.1.22',
    ultimoMesPagado: '2026-06-30', // cortado manually
    estado: 'Cortado',
  },
  {
    id: 4,
    fechaConexion: '2025-11-05',
    abonado: 'Sandra Reyes',
    plan: '10 Mbps',
    valor: 350,
    ip: '192.168.1.23',
    ultimoMesPagado: '2026-07-31', // paid through July → 35 days mora
    estado: 'En mora',
  },
  {
    id: 5,
    fechaConexion: '2026-04-01',
    abonado: 'Roberto Flores',
    plan: '100 Mbps',
    valor: 1200,
    ip: '192.168.1.24',
    ultimoMesPagado: '2026-08-31', // paid through August → current
    estado: 'Activo',
  },
  {
    id: 6,
    fechaConexion: '2025-09-12',
    abonado: 'Ana Martínez',
    plan: '20 Mbps',
    valor: 500,
    ip: '192.168.1.25',
    ultimoMesPagado: '2026-06-30', // paid through June → 66 days mora
    estado: 'En mora',
  },
  {
    id: 7,
    fechaConexion: '2026-05-18',
    abonado: 'Luis Hernández',
    plan: '30 Mbps',
    valor: 600,
    ip: '192.168.1.26',
    ultimoMesPagado: '2026-08-31', // paid through August → current
    estado: 'Activo',
  },
  {
    id: 8,
    fechaConexion: '2025-06-30',
    abonado: 'Carmen Ramos',
    plan: '50 Mbps',
    valor: 800,
    ip: '192.168.1.27',
    ultimoMesPagado: '2026-08-31', // paid through August → current
    estado: 'Activo',
  },
]
