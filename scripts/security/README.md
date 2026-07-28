# Pentest automatizado

Grey-box tests alineados con [`docs/plan-pentesting.md`](../../docs/plan-pentesting.md).

## Requisitos

1. `cp .env.pentest.example .env.pentest` y completar credenciales de prueba.
2. `.env.local` con Supabase (`NEXT_PUBLIC_SUPABASE_*`) y URLs de BD.
3. `DATABASE_URL_AGENDA_APP` con usuario `agenda_app.PROJECT_REF` en pooler (puerto 6543).
4. Servidor: `npm run dev` en `http://localhost:3000`.

Validar URLs: `node scripts/validate-db-urls.mjs`

## Comandos

```bash
npm run pentest                 # P0 + P1 (15 suites)
npm run pentest:p0              # Solo PT-01, PT-02, PT-03
npm run pentest:p2              # Pagos, webhooks, tokens, Excel
npm run pentest:p3              # Rate limit, cookies, branding, auditoría
npm run pentest:rls             # Verificación RLS (SQL en PostgreSQL)
npm run pentest:rls-cross-tenant # Aislamiento agenda_app entre tenants
npm run pentest:all             # Todo lo anterior
```

Suite individual:

```bash
node scripts/security/run-pentest.mjs --only PT-02
```

## Cobertura por prioridad

| Comando | Suites |
|---------|--------|
| P0/P1 | PT-01–09, 16, 18, 26, 30, 31, 37 |
| P2 | PT-10–15, 17, 20–23 |
| P3 | PT-19, 24, 25, 28, 29, 32–36, 38 |
| RLS | `verify-rls.sql` + cross-tenant automatizado |

## Verificación RLS

**SQL manual:** `scripts/security/sql/verify-rls.sql` en Supabase SQL Editor.

**CLI:**

```bash
npm run pentest:rls
npm run pentest:rls-cross-tenant
```

Consulta 7 de `verify-rls.sql` debe devolver **0 filas**.

## Resolver ID institución B

```bash
node scripts/security/resolve-institution-id.mjs
```

Resultados documentados en [`docs/resultado.md`](../../docs/resultado.md).
