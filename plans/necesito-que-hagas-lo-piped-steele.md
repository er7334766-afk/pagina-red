# Plan: ISP Admin Application

## Context

Build a simple internal administrative tool for a small Internet Service Provider. The app manages clients, their payment status, and delinquency (mora). The spec explicitly excludes inventory, advanced billing, multiple services per client, and reporting — keep it lean. Data is in-memory (no backend required).

## Screens

1. **Dashboard** — KPI cards + "Clientes en mora" table with "Registrar pago" action
2. **Clientes** — Full client list with search, status filter, and "+ Nuevo cliente" button
3. **Crear/Editar cliente** — Modal form
4. **Registrar pago** — Modal with multi-month payment logic
5. **Confirmación de baja** — Inline confirmation modal

## Data Model

```ts
type Estado = 'Activo' | 'En mora' | 'Cortado'

interface Cliente {
  id: number
  fechaConexion: string        // ISO date
  abonado: string
  plan: string                 // e.g. "20 Mbps"
  valor: number                // monthly fee in Lempiras
  ip: string
  ultimoMesPagado: string      // ISO date (last day of paid month)
  estado: Estado
}
```

## Mora Logic

- `diasMora`: days since the last day of `ultimoMesPagado` (compared against today)
- If `diasMora >= 5` → show "EN MORA"; client appears in dashboard mora table
- "Cortado" is a manual state set via "Dar de baja" — unrelated to automatic mora logic

## Payment Logic

- Modal shows client info + form: fecha del pago, cantidad de meses (1/2/3/6/12), monto total (auto-calculated)
- On save: advance `ultimoMesPagado` by N months, recalculate `estado` (if no longer >= 5 days late, set to 'Activo')
- Show toast: "Pago registrado correctamente"

## File Structure

```
src/
  App.tsx                  — router + sidebar layout
  index.css                — global styles + font wiring
  data/
    mockData.ts            — initial seed clients (5–8 realistic HN records)
  types/
    index.ts               — Cliente, Estado types
  store/
    useClientes.ts         — useState hook encapsulating all client state + actions
  components/
    Sidebar.tsx
    Dashboard.tsx
    Clientes.tsx
    ClienteModal.tsx       — create/edit form modal
    PagoModal.tsx          — register payment modal
    BajaModal.tsx          — deactivation confirmation modal
    StatusBadge.tsx        — Activo/En mora/Cortado badge
    Toast.tsx              — success notification
```

## Critical Implementation Notes

- No router library needed — use a simple `useState` for active page ('dashboard' | 'clientes')
- All state lives in `useClientes` hook (array of clients + CRUD + payment actions)
- Mora is computed on render — not stored in state (derived from `ultimoMesPagado` vs today)
- "Dar de baja" sets `estado = 'Cortado'`, never deletes records
- Dashboard KPI cards: total, activos, en mora, cortados (counts derived from client array)
- Dashboard mora table: clients where `diasMora >= 5 && estado !== 'Cortado'`

## Aesthetic

Committed after user picks from lo-fi mockups. `guidelines/Guidelines.md` written then.

## Verification

1. Dev server runs at `$PORT` — check preview panel after changes
2. Confirm: dashboard KPI counts update when payment is registered
3. Confirm: client disappears from mora table after paying current month
4. Confirm: "Dar de baja" keeps record but changes state badge to "Cortado"
5. Confirm: paying 3 months advances `ultimoMesPagado` by exactly 3 months
