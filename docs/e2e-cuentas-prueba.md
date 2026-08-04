# Cuentas E2E de prueba — Agenda Virtual

Datos del run exitoso **`249040`** (4 ago 2026).  
Servidor: local (`http://localhost:3000`) vía Gestión Vortico → invitaciones trial.  
Canal de recordatorios: **solo email** (Plan Básico).  
Contraseña de todas las cuentas de prueba: la definida en `.env.e2e` como `E2E_PASSWORD` / `E2E_GV_PASSWORD` (provisional de pruebas).

> No subir `.env.e2e` al repositorio. Este documento lista correos e IDs para revisión manual.

---

## Operador Gestión Vortico

| Campo | Valor |
|---|---|
| Email | `jonathanasias@gmail.com` |
| Panel | `/gestion-vortico` |
| Rol | Platform admin (`PLATFORM_ADMIN_EMAILS`) |

---

## Institución 1 — flujo wizard (lotes `/api/setup/*`)

| Campo | Valor |
|---|---|
| ID institución | **26** |
| Nombre | `E2E Test Inst 1 249040` |
| Email institución | `jonathanasias+inst1r249040@gmail.com` |
| Modo alta | Wizard (grados/cursos/áreas/materias/docente/estudiantes en lote) |
| Estudiantes | 15 |
| Recordatorio email | id **15** (5 acudientes del mismo curso) |

### Docente Inst 1

| Campo | Valor |
|---|---|
| Email | `jonathanasias+doc1r249040@gmail.com` |
| Nombre | Docente E2E1 |

### Acudientes Inst 1 (estudiantes 1–15)

Correo patrón: `jonathanasias+acu{N}r249040@gmail.com`

| # | Correo acudiente |
|---|---|
| 1 | `jonathanasias+acu1r249040@gmail.com` |
| 2 | `jonathanasias+acu2r249040@gmail.com` |
| 3 | `jonathanasias+acu3r249040@gmail.com` |
| 4 | `jonathanasias+acu4r249040@gmail.com` |
| 5 | `jonathanasias+acu5r249040@gmail.com` |
| 6 | `jonathanasias+acu6r249040@gmail.com` |
| 7 | `jonathanasias+acu7r249040@gmail.com` |
| 8 | `jonathanasias+acu8r249040@gmail.com` |
| 9 | `jonathanasias+acu9r249040@gmail.com` |
| 10 | `jonathanasias+acu10r249040@gmail.com` |
| 11 | `jonathanasias+acu11r249040@gmail.com` |
| 12 | `jonathanasias+acu12r249040@gmail.com` |
| 13 | `jonathanasias+acu13r249040@gmail.com` |
| 14 | `jonathanasias+acu14r249040@gmail.com` |
| 15 | `jonathanasias+acu15r249040@gmail.com` |

---

## Institución 2 — alta manual (elemento por elemento)

| Campo | Valor |
|---|---|
| ID institución | **27** |
| Nombre | `E2E Test Inst 2 249040` |
| Email institución | `jonathanasias+inst2r249040@gmail.com` |
| Modo alta | Manual (cursos uno a uno, materia, docente, 15 estudiantes uno a uno) |
| Estudiantes | 15 |
| Recordatorio email | id **16** (5 acudientes del mismo curso) |

### Docente Inst 2

| Campo | Valor |
|---|---|
| Email | `jonathanasias+doc2r249040@gmail.com` |
| Nombre | Docente Manual2 |

### Acudientes Inst 2 (estudiantes 16–30)

| # | Correo acudiente |
|---|---|
| 16 | `jonathanasias+acu16r249040@gmail.com` |
| 17 | `jonathanasias+acu17r249040@gmail.com` |
| 18 | `jonathanasias+acu18r249040@gmail.com` |
| 19 | `jonathanasias+acu19r249040@gmail.com` |
| 20 | `jonathanasias+acu20r249040@gmail.com` |
| 21 | `jonathanasias+acu21r249040@gmail.com` |
| 22 | `jonathanasias+acu22r249040@gmail.com` |
| 23 | `jonathanasias+acu23r249040@gmail.com` |
| 24 | `jonathanasias+acu24r249040@gmail.com` |
| 25 | `jonathanasias+acu25r249040@gmail.com` |
| 26 | `jonathanasias+acu26r249040@gmail.com` |
| 27 | `jonathanasias+acu27r249040@gmail.com` |
| 28 | `jonathanasias+acu28r249040@gmail.com` |
| 29 | `jonathanasias+acu29r249040@gmail.com` |
| 30 | `jonathanasias+acu30r249040@gmail.com` |

---

## Admin vs institución

En este E2E la cuenta **institución** (`+inst…`) actúa también como admin de setup (`ADMIN_ROLES` incluye `institucion`).  
No se crearon filas separadas `+admin1` / `+admin2` en el run `249040`; el login de institución basta para el wizard y el alta manual.

Si más adelante se prueban admins dedicados, usar:

- `jonathanasias+admin1@gmail.com`
- `jonathanasias+admin2@gmail.com`

---

## Comprobaciones hechas en el run

- Cross-tenant: docente Inst 1 → recursos Inst 2 → **403**
- Invitaciones trial desde Gestión Vortico (sin Wompi/Mercado Pago)
- Recordatorios solo canal **email**

## Cómo repetir

```bash
# .env.e2e configurado + servidor npm run dev
npm run e2e:ensure-gv   # opcional: asegura usuario GV
npm run e2e:trial
```

Cada run genera un `RUN_ID` nuevo en los correos (`…r{RUN_ID}@gmail.com`) para no chocar con datos previos.

## Nota sobre correos recibidos

Hubo varios intentos fallidos antes del run exitoso; por eso llegaron ~10 invitaciones trial y solo **2** recordatorios del cierre OK. Los correos de recordatorio anteriores podían salir **sin imagen** de Copetón (URL localhost); el fix de imagen embebida (CID) aplica a envíos nuevos tras el deploy.
