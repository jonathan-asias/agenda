import * as XLSX from 'xlsx';

export const ESTUDIANTES_SHEET = 'Estudiantes';
export const INSTRUCCIONES_SHEET = 'Instrucciones';
export const GRADOS_SHEET = 'Grados';
export const CURSOS_SHEET = 'Cursos';
export const MATERIAS_SHEET = 'Materias';

export const ESTUDIANTE_HEADERS = [
  'nombres',
  'apellidos',
  'codigo_estudiantil',
  'nombre_acudiente',
  'telefono_acudiente',
  'correo_acudiente',
  'grado_id',
  'curso_id',
] as const;

export type EstudianteExcelRow = {
  nombres: string;
  apellidos: string;
  codigo_estudiantil: string;
  nombre_acudiente: string;
  telefono_acudiente: string;
  correo_acudiente: string | null;
  grado_id: number;
  curso_id: number;
  fila: number;
};

export type GradoRef = { id: number; nombre: string; nivel: string };
export type CursoRef = {
  id: number;
  nombre: string;
  grado_id: number;
  grado_nombre: string;
};
export type MateriaRef = { id: number; nombre: string; area: string };

const NOMBRE_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cellString(value: unknown): string {
  if (value === null || value === undefined) return '';
  let s = String(value).trim();
  if (/^[=+\-@]/.test(s)) {
    s = s.replace(/^[=+\-@]+/, '');
  }
  return s;
}

function sheetHasFormulaCells(sheet: XLSX.WorkSheet): boolean {
  if (!sheet['!ref']) return false;
  const range = XLSX.utils.decode_range(sheet['!ref']);
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })];
      if (cell?.t === 'f') return true;
    }
  }
  return false;
}

function cellNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeHeader(value: unknown): string {
  return cellString(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');
}

export function buildEstudiantesWorkbook(data: {
  grados: GradoRef[];
  cursos: CursoRef[];
  materias: MateriaRef[];
  institucionNombre?: string;
}): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  const instrucciones = [
    ['Carga masiva de estudiantes'],
    [''],
    [
      '1. Complete la hoja "Estudiantes" con un registro por fila (a partir de la fila 2).',
    ],
    [
      '2. Use grado_id y curso_id de las hojas "Grados" y "Cursos" (solo valores de su sede).',
    ],
    ['3. La hoja "Materias" es referencia; no es obligatoria para registrar estudiantes.'],
    ['4. correo_acudiente es opcional. Los demás campos son obligatorios.'],
    ['5. codigo_estudiantil debe ser único en la institución (mínimo 3 caracteres).'],
    [''],
    ...(data.institucionNombre
      ? [[`Institución: ${data.institucionNombre}`]]
      : []),
    [`Generado: ${new Date().toLocaleString('es-CO')}`],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(instrucciones),
    INSTRUCCIONES_SHEET
  );

  const estudiantesSheet = XLSX.utils.aoa_to_sheet([
    [...ESTUDIANTE_HEADERS],
    [
      'Ejemplo',
      'Estudiante',
      'EST-001',
      'Nombre Acudiente',
      '+573001234567',
      'acudiente@ejemplo.com',
      data.grados[0]?.id ?? '',
      data.cursos[0]?.id ?? '',
    ],
  ]);
  estudiantesSheet['!cols'] = [
    { wch: 18 },
    { wch: 18 },
    { wch: 16 },
    { wch: 22 },
    { wch: 18 },
    { wch: 26 },
    { wch: 10 },
    { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, estudiantesSheet, ESTUDIANTES_SHEET);

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(
      data.grados.map((g) => ({
        grado_id: g.id,
        nombre: g.nombre,
        nivel: g.nivel,
      }))
    ),
    GRADOS_SHEET
  );

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(
      data.cursos.map((c) => ({
        curso_id: c.id,
        nombre: c.nombre,
        grado_id: c.grado_id,
        grado_nombre: c.grado_nombre,
      }))
    ),
    CURSOS_SHEET
  );

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(
      data.materias.map((m) => ({
        materia_id: m.id,
        nombre: m.nombre,
        area: m.area,
      }))
    ),
    MATERIAS_SHEET
  );

  return wb;
}

export function workbookToXlsxBuffer(wb: XLSX.WorkBook): Buffer {
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

export function parseEstudiantesWorkbook(buffer: Buffer): {
  rows: EstudianteExcelRow[];
  errores: string[];
} {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const sheet =
    wb.Sheets[ESTUDIANTES_SHEET] ??
    wb.Sheets[wb.SheetNames.find((n) => n !== INSTRUCCIONES_SHEET) ?? ''];

  if (!sheet) {
    return { rows: [], errores: ['No se encontró la hoja "Estudiantes" en el archivo.'] };
  }

  if (sheetHasFormulaCells(sheet)) {
    return {
      rows: [],
      errores: [
        'El archivo contiene fórmulas en celdas. Use solo valores de texto o número.',
      ],
    };
  }

  const matrix = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
    header: 1,
    defval: '',
    blankrows: false,
  });

  if (matrix.length < 2) {
    return {
      rows: [],
      errores: ['El archivo no contiene filas de estudiantes (solo encabezados).'],
    };
  }

  const headerRow = matrix[0].map(normalizeHeader);
  const colIndex: Partial<Record<(typeof ESTUDIANTE_HEADERS)[number], number>> = {};

  for (const h of ESTUDIANTE_HEADERS) {
    const idx = headerRow.indexOf(h);
    if (idx === -1) {
      return {
        rows: [],
        errores: [`Falta la columna obligatoria "${h}" en la hoja Estudiantes.`],
      };
    }
    colIndex[h] = idx;
  }

  const rows: EstudianteExcelRow[] = [];
  const errores: string[] = [];
  const codigosVistos = new Set<string>();

  for (let i = 1; i < matrix.length; i++) {
    const line = matrix[i];
    const fila = i + 1;
    const get = (key: (typeof ESTUDIANTE_HEADERS)[number]) =>
      cellString(line[colIndex[key] ?? -1]);

    const nombres = get('nombres');
    const apellidos = get('apellidos');
    const codigo = get('codigo_estudiantil');
    const nombreAcudiente = get('nombre_acudiente');
    const telefono = get('telefono_acudiente');
    const correoRaw = get('correo_acudiente');
    const gradoId = cellNumber(line[colIndex.grado_id ?? -1]);
    const cursoId = cellNumber(line[colIndex.curso_id ?? -1]);

    const vacia =
      !nombres &&
      !apellidos &&
      !codigo &&
      !nombreAcudiente &&
      !telefono &&
      !correoRaw &&
      gradoId === null &&
      cursoId === null;

    if (vacia) continue;

    if (nombres.toLowerCase() === 'ejemplo' && apellidos.toLowerCase() === 'estudiante') {
      continue;
    }

    if (!nombres || !apellidos || !codigo || !nombreAcudiente || !telefono) {
      const faltantes: string[] = [];
      if (!nombres) faltantes.push('nombres');
      if (!apellidos) faltantes.push('apellidos');
      if (!codigo) faltantes.push('codigo_estudiantil');
      if (!nombreAcudiente) faltantes.push('nombre_acudiente');
      if (!telefono) faltantes.push('telefono_acudiente');
      errores.push(`Fila ${fila}: campos vacíos o incompletos: ${faltantes.join(', ')}.`);
      continue;
    }
    if (!NOMBRE_REGEX.test(nombres)) {
      errores.push(`Fila ${fila}: nombres inválidos (solo letras).`);
      continue;
    }
    if (!NOMBRE_REGEX.test(apellidos)) {
      errores.push(`Fila ${fila}: apellidos inválidos (solo letras).`);
      continue;
    }
    if (!NOMBRE_REGEX.test(nombreAcudiente)) {
      errores.push(`Fila ${fila}: nombre del acudiente inválido.`);
      continue;
    }
    if (codigo.length < 3) {
      errores.push(`Fila ${fila}: código estudiantil muy corto (mín. 3).`);
      continue;
    }
    const codigoKey = codigo.toLowerCase();
    if (codigosVistos.has(codigoKey)) {
      errores.push(`Fila ${fila}: código "${codigo}" duplicado en el archivo.`);
      continue;
    }
    codigosVistos.add(codigoKey);

    if (correoRaw && !EMAIL_REGEX.test(correoRaw)) {
      errores.push(`Fila ${fila}: correo del acudiente inválido.`);
      continue;
    }
    if (gradoId === null || gradoId <= 0) {
      errores.push(`Fila ${fila}: grado_id inválido.`);
      continue;
    }
    if (cursoId === null || cursoId <= 0) {
      errores.push(`Fila ${fila}: curso_id inválido.`);
      continue;
    }

    rows.push({
      nombres,
      apellidos,
      codigo_estudiantil: codigo,
      nombre_acudiente: nombreAcudiente,
      telefono_acudiente: telefono,
      correo_acudiente: correoRaw || null,
      grado_id: gradoId,
      curso_id: cursoId,
      fila,
    });
  }

  if (rows.length === 0 && errores.length === 0) {
    errores.push('No hay filas de estudiantes válidas para importar.');
  }

  return { rows, errores };
}
