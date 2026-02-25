# Auditoría de peso del proyecto

**Fecha:** 16 de febrero de 2025  
**Proyecto:** agenda-virtual

## Peso por carpeta

| Carpeta / Área | Bytes | Aproximado |
|----------------|-------|------------|
| node_modules   | 848.112.868 | ~808 MB |
| .next          | 736.132.041 | ~702 MB |
| src            | 1.129.774   | ~1,08 MB |
| public         | 3.314       | ~3 KB    |
| prisma         | 26.578      | ~26 KB   |
| src/components | 6.350       | ~6 KB    |
| **TOTAL**      | **1.585.410.925** | **~1,48 GB** |

## Notas

- La mayor parte del peso corresponde a **node_modules** y **.next** (caché de build).
- `.next` puede regenerarse con `npm run build` y no debe versionarse.
- `node_modules` se regenera con `npm install`.
