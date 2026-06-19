import type { Prisma } from '@prisma/client';
import {
  assertRecordBelongsToSede,
  institutionSedeWhere,
  type SedeScope,
} from '@/lib/sede-scope';
import type { EstudianteExcelRow } from '@/lib/estudiantes-excel';

export type ValidacionFilaDetalle = {
  fila: number;
  codigo_estudiantil: string;
  nombres: string;
  apellidos: string;
  valida: boolean;
  errores: string[];
};

export type ResultadoValidacionCarga = {
  valido: boolean;
  totalFilas: number;
  filasValidas: number;
  filasConError: number;
  errores: string[];
  advertencias: string[];
  duplicadosEnArchivo: Array<{ codigo: string; filas: number[] }>;
  duplicadosEnSistema: string[];
  detalleFilas: ValidacionFilaDetalle[];
};

export async function validateEstudiantesForImport(
  tx: Prisma.TransactionClient,
  institutionId: number,
  scope: SedeScope,
  rows: EstudianteExcelRow[],
  erroresParseo: string[]
): Promise<ResultadoValidacionCarga> {
  const errores = [...erroresParseo];
  const advertencias: string[] = [];
  const detalleFilas: ValidacionFilaDetalle[] = [];
  const duplicadosMap = new Map<string, number[]>();

  for (const row of rows) {
    const key = row.codigo_estudiantil.toLowerCase();
    const filas = duplicadosMap.get(key) ?? [];
    filas.push(row.fila);
    duplicadosMap.set(key, filas);
  }

  const duplicadosEnArchivo = [...duplicadosMap.entries()]
    .filter(([, filas]) => filas.length > 1)
    .map(([codigo, filas]) => ({
      codigo: rows.find((r) => r.codigo_estudiantil.toLowerCase() === codigo)?.codigo_estudiantil ??
        codigo,
      filas,
    }));

  for (const dup of duplicadosEnArchivo) {
    errores.push(
      `Código duplicado en el archivo: "${dup.codigo}" en filas ${dup.filas.join(', ')}.`
    );
  }

  const codigosUnicos = [...new Set(rows.map((r) => r.codigo_estudiantil))];
  const existentesDb =
    codigosUnicos.length > 0
      ? await tx.estudiantes.findMany({
          where: {
            institucion_id: institutionId,
            codigo_estudiantil: { in: codigosUnicos },
          },
          select: { codigo_estudiantil: true },
        })
      : [];

  const duplicadosEnSistema = existentesDb.map((e) => e.codigo_estudiantil);
  for (const codigo of duplicadosEnSistema) {
    const filasCodigo = rows
      .filter((r) => r.codigo_estudiantil === codigo)
      .map((r) => r.fila);
    errores.push(
      `Código "${codigo}" ya registrado en el sistema (fila${filasCodigo.length > 1 ? 's' : ''} ${filasCodigo.join(', ')}).`
    );
  }

  const baseWhere = institutionSedeWhere(institutionId, scope);
  const [grados, cursos] = await Promise.all([
    tx.grados.findMany({
      where: baseWhere,
      select: { id: true, sede_id: true },
    }),
    tx.cursos.findMany({
      where: baseWhere,
      select: { id: true, grado_id: true, sede_id: true },
    }),
  ]);

  const gradoMap = new Map(grados.map((g) => [g.id, g]));
  const cursoMap = new Map(cursos.map((c) => [c.id, c]));

  for (const row of rows) {
    const filaErrores: string[] = [];

    if (duplicadosEnArchivo.some((d) => d.filas.includes(row.fila) && d.filas[0] !== row.fila)) {
      filaErrores.push('Código duplicado con otra fila del archivo.');
    }
    if (duplicadosEnSistema.includes(row.codigo_estudiantil)) {
      filaErrores.push('Código ya existe en el sistema.');
    }

    const grado = gradoMap.get(row.grado_id);
    if (!grado) {
      filaErrores.push(`grado_id ${row.grado_id} no existe en su sede.`);
    } else {
      try {
        assertRecordBelongsToSede(grado.sede_id, scope);
      } catch {
        filaErrores.push(`grado_id ${row.grado_id} no pertenece a su sede.`);
      }
    }

    const curso = cursoMap.get(row.curso_id);
    if (!curso) {
      filaErrores.push(`curso_id ${row.curso_id} no existe en su sede.`);
    } else {
      try {
        assertRecordBelongsToSede(curso.sede_id, scope);
      } catch {
        filaErrores.push(`curso_id ${row.curso_id} no pertenece a su sede.`);
      }
      if (grado && curso.grado_id !== row.grado_id) {
        filaErrores.push(
          `curso_id ${row.curso_id} no corresponde al grado_id ${row.grado_id}.`
        );
      }
    }

    if (!row.telefono_acudiente.trim()) {
      filaErrores.push('teléfono del acudiente vacío.');
    } else if (row.telefono_acudiente.replace(/\D/g, '').length < 10) {
      advertencias.push(
        `Fila ${row.fila}: revise el formato del teléfono "${row.telefono_acudiente}".`
      );
    }

    const filaValida = filaErrores.length === 0;
    if (!filaValida) {
      for (const msg of filaErrores) {
        errores.push(`Fila ${row.fila}: ${msg}`);
      }
    }

    detalleFilas.push({
      fila: row.fila,
      codigo_estudiantil: row.codigo_estudiantil,
      nombres: row.nombres,
      apellidos: row.apellidos,
      valida: filaValida,
      errores: filaErrores,
    });
  }

  const filasValidas = detalleFilas.filter((f) => f.valida).length;
  const filasConError = detalleFilas.length - filasValidas;
  const valido =
    rows.length > 0 &&
    erroresParseo.length === 0 &&
    duplicadosEnArchivo.length === 0 &&
    duplicadosEnSistema.length === 0 &&
    filasConError === 0;

  if (rows.length === 0 && erroresParseo.length === 0) {
    errores.push('No hay filas de estudiantes para importar.');
  }

  return {
    valido,
    totalFilas: rows.length,
    filasValidas,
    filasConError,
    errores: [...new Set(errores)],
    advertencias: [...new Set(advertencias)],
    duplicadosEnArchivo,
    duplicadosEnSistema,
    detalleFilas,
  };
}

export const MAX_EXCEL_UPLOAD_BYTES = 5 * 1024 * 1024;

export function assertExcelUploadFile(file: unknown): File {
  if (!(file instanceof File)) {
    throw new Error('Debe adjuntar un archivo Excel (.xlsx o .xls)');
  }
  if (file.size > MAX_EXCEL_UPLOAD_BYTES) {
    throw new Error('El archivo supera el tamaño máximo (5 MB)');
  }
  const name = file.name.toLowerCase();
  if (!name.endsWith('.xlsx') && !name.endsWith('.xls')) {
    throw new Error('Formato no válido. Use .xlsx o .xls');
  }
  return file;
}
