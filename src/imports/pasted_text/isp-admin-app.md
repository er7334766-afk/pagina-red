Diseña una aplicación web administrativa sencilla para una pequeña empresa proveedora de Internet (ISP).

IMPORTANTE: mantener el sistema SIMPLE. No agregar módulos innecesarios como inventario, facturación avanzada, múltiples servicios por cliente, planes independientes, reportes complejos, usuarios, etc.

El sistema solamente debe gestionar clientes, su estado, sus pagos y la mora.

## NAVEGACIÓN

Crear un sidebar con únicamente:

* Dashboard
* Clientes

## 1. DASHBOARD

El Dashboard será la página principal.

Mostrar tarjetas superiores con:

* Total de clientes
* Clientes activos
* Clientes en mora
* Servicios cortados

Debajo mostrar una sección:

"Clientes en mora"

Crear una tabla con:

* Abonado
* Plan
* Valor
* IP
* Último mes pagado
* Días de mora
* Estado
* Acción

Los clientes que tengan 5 días o más de retraso deben aparecer claramente identificados como "EN MORA".

Cada cliente en mora debe tener un botón:

"Registrar pago"

Al presionar "Registrar pago", mostrar un modal donde se pueda seleccionar:

* Mes que está pagando
* Cantidad de meses que desea pagar
* Monto total
* Fecha del pago

El sistema debe permitir que un cliente pague más de un mes por adelantado.

Ejemplo:

Un cliente puede pagar:

* 1 mes
* 2 meses
* 3 meses
* 6 meses
* 12 meses

El diseño debe permitir seleccionar fácilmente cuántos meses está pagando.

Al registrar el pago, actualizar automáticamente el campo "Último mes pagado".

Ejemplo:

Si el cliente tenía pagado hasta agosto de 2026 y paga 3 meses:

Último mes pagado → Noviembre 2026.

Después de registrar el pago, el cliente debe dejar de aparecer como moroso si el pago cubre el período correspondiente.

---

# 2. CLIENTES

Crear una pantalla llamada:

"Clientes"

En la parte superior colocar:

* Buscador
* Filtro por estado
* Botón "+ Nuevo cliente"

La tabla principal debe contener EXACTAMENTE estos campos:

* Fecha
* Abonado
* Plan
* Valor
* IP
* Último mes pagado
* Estado
* Acciones

Agregar una columna ID únicamente si es necesaria para identificar internamente los registros.

Ejemplo de información:

| Fecha      | Abonado     | Plan    | Valor | IP           | Último mes pagado | Estado  |
| ---------- | ----------- | ------- | ----: | ------------ | ----------------- | ------- |
| 10/01/2026 | Juan Pérez  | 20 Mbps | L 500 | 192.168.1.20 | Agosto 2026       | Activo  |
| 15/02/2026 | María López | 30 Mbps | L 600 | 192.168.1.21 | Julio 2026        | En mora |
| 20/03/2026 | Carlos Díaz | 50 Mbps | L 800 | 192.168.1.22 | Junio 2026        | Cortado |

## ACCIONES DE CADA CLIENTE

En cada fila colocar:

* Editar
* Registrar pago
* Dar de baja

NO colocar botón "Eliminar".

Los clientes nunca deben eliminarse físicamente del sistema.

"Dar de baja" debe cambiar el estado del cliente a "Cortado" o "Dado de baja", pero conservar el registro.

Antes de darlo de baja mostrar una confirmación:

"¿Está seguro de que desea dar de baja este cliente?"

Botones:

"Cancelar"

"Dar de baja"

---

# 3. CREAR / EDITAR CLIENTE

Crear un formulario o modal para crear y editar clientes.

Campos:

* Fecha de conexión
* Nombre del abonado
* Plan
* Valor mensual
* Dirección IP
* Último mes pagado
* Estado

El campo Estado debe ser un selector.

Opciones:

* Activo
* En mora
* Cortado

El botón de guardar debe decir:

"Guardar cliente"

Al editar un cliente, utilizar el mismo formulario.

---

# 4. ESTADOS

Crear una pequeña tabla/estructura para manejar los estados de los clientes.

Tabla conceptual:

ESTADOS

* ID
* Nombre

Registros iniciales:

1. Activo
2. En mora
3. Cortado

El estado debe mostrarse visualmente mediante badges.

Activo → badge verde.

En mora → badge rojo.

Cortado → badge gris/oscuro.

IMPORTANTE:

El estado "En mora" debe estar relacionado con el pago atrasado.

El estado "Cortado" significa que la empresa dio de baja/cortó el servicio.

Un cliente dado de baja NO debe eliminarse de la tabla de clientes.

---

# 5. LÓGICA DE MORA

El sistema debe considerar la fecha habitual de pago y el último mes pagado para determinar si existe retraso.

Cuando hayan pasado 5 días desde la fecha en que debía realizarse el pago y el cliente todavía no haya pagado, mostrar:

"EN MORA"

En el Dashboard debe aparecer automáticamente dentro de:

"Clientes en mora"

Mostrar también:

"Días de mora"

Ejemplo:

Último pago: Agosto 2026

Fecha esperada de pago: 31/08/2026

Fecha actual: 05/09/2026

Días de mora: 5

Estado: EN MORA

---

# 6. REGISTRAR PAGO

El botón "Registrar pago" debe estar disponible tanto en el Dashboard como en la tabla de Clientes.

Al abrirlo mostrar:

"Registrar pago"

Información del cliente:

* Abonado
* Plan
* Valor mensual
* Último mes pagado
* Estado actual

Formulario:

* Fecha del pago
* Cantidad de meses a pagar
* Monto total

La cantidad de meses debe poder ser mayor a uno.

Ejemplo:

Valor mensual: L 500

Cantidad de meses: 3

Total: L 1,500

Después de guardar:

* Actualizar "Último mes pagado".
* Actualizar el estado del cliente.
* Quitar al cliente del listado de morosos cuando corresponda.
* Mostrar una notificación: "Pago registrado correctamente".

---

# 7. DISEÑO

Utilizar un diseño de dashboard administrativo moderno, limpio y sencillo.

Priorizar:

* Tablas fáciles de leer.
* Acciones rápidas.
* Buena visualización del estado.
* Identificación inmediata de clientes en mora.
* Registro de pagos rápido.
* Diseño pensado para empleados que utilizarán el sistema diariamente.

No crear funcionalidades que no hayan sido solicitadas.

La aplicación debe sentirse como una herramienta administrativa interna para una empresa de Internet.

Generar las siguientes pantallas:

1. Dashboard
2. Lista de clientes
3. Crear cliente
4. Editar cliente
5. Modal de registrar pago
6. Confirmación de baja

Utilizar datos ficticios realistas para mostrar cómo funcionaría la interfaz.
