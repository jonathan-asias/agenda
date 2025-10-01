-- Migration: Add Educational System Models
-- Created manually because database is not accessible via Prisma CLI

-- Create Grados table
CREATE TABLE "Grados" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "nivel" VARCHAR(50) NOT NULL,
    "orden" INTEGER NOT NULL,
    "institucion_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Grados_pkey" PRIMARY KEY ("id")
);

-- Create Cursos table
CREATE TABLE "Cursos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "grado_id" INTEGER NOT NULL,
    "jornada" VARCHAR(50),
    "sede_id" INTEGER,
    "institucion_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cursos_pkey" PRIMARY KEY ("id")
);

-- Create Areas table
CREATE TABLE "Areas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "es_opcional" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL,
    "institucion_id" INTEGER NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Areas_pkey" PRIMARY KEY ("id")
);

-- Create Materias table
CREATE TABLE "Materias" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "area_id" INTEGER NOT NULL,
    "institucion_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Materias_pkey" PRIMARY KEY ("id")
);

-- Create MateriaGrados table (many-to-many)
CREATE TABLE "MateriaGrados" (
    "id" SERIAL NOT NULL,
    "materia_id" INTEGER NOT NULL,
    "grado_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MateriaGrados_pkey" PRIMARY KEY ("id")
);

-- Create Docentes table
CREATE TABLE "Docentes" (
    "id" SERIAL NOT NULL,
    "apellidos" VARCHAR(255) NOT NULL,
    "nombres" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "institucion_id" INTEGER NOT NULL,
    "sede_id" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Docentes_pkey" PRIMARY KEY ("id")
);

-- Create DocenteAsignaciones table
CREATE TABLE "DocenteAsignaciones" (
    "id" SERIAL NOT NULL,
    "docente_id" INTEGER NOT NULL,
    "curso_id" INTEGER NOT NULL,
    "materia_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocenteAsignaciones_pkey" PRIMARY KEY ("id")
);

-- Create Estudiantes table
CREATE TABLE "Estudiantes" (
    "id" SERIAL NOT NULL,
    "apellidos" VARCHAR(255) NOT NULL,
    "nombres" VARCHAR(255) NOT NULL,
    "codigo_estudiantil" VARCHAR(50) NOT NULL,
    "nombre_acudiente" VARCHAR(255) NOT NULL,
    "correo_acudiente" VARCHAR(255),
    "telefono_acudiente" VARCHAR(20) NOT NULL,
    "curso_id" INTEGER NOT NULL,
    "institucion_id" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Estudiantes_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "Docentes_email_key" ON "Docentes"("email");
CREATE UNIQUE INDEX "MateriaGrados_materia_id_grado_id_key" ON "MateriaGrados"("materia_id", "grado_id");
CREATE UNIQUE INDEX "DocenteAsignaciones_docente_id_curso_id_materia_id_key" ON "DocenteAsignaciones"("docente_id", "curso_id", "materia_id");
CREATE UNIQUE INDEX "Estudiantes_codigo_estudiantil_institucion_id_key" ON "Estudiantes"("codigo_estudiantil", "institucion_id");

-- Add Foreign Keys for Grados
ALTER TABLE "Grados" ADD CONSTRAINT "Grados_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "Instituciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add Foreign Keys for Cursos
ALTER TABLE "Cursos" ADD CONSTRAINT "Cursos_grado_id_fkey" FOREIGN KEY ("grado_id") REFERENCES "Grados"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Cursos" ADD CONSTRAINT "Cursos_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "Instituciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Cursos" ADD CONSTRAINT "Cursos_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "Sedes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add Foreign Keys for Areas
ALTER TABLE "Areas" ADD CONSTRAINT "Areas_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "Instituciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add Foreign Keys for Materias
ALTER TABLE "Materias" ADD CONSTRAINT "Materias_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Materias" ADD CONSTRAINT "Materias_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "Instituciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add Foreign Keys for MateriaGrados
ALTER TABLE "MateriaGrados" ADD CONSTRAINT "MateriaGrados_materia_id_fkey" FOREIGN KEY ("materia_id") REFERENCES "Materias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MateriaGrados" ADD CONSTRAINT "MateriaGrados_grado_id_fkey" FOREIGN KEY ("grado_id") REFERENCES "Grados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add Foreign Keys for Docentes
ALTER TABLE "Docentes" ADD CONSTRAINT "Docentes_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "Instituciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Docentes" ADD CONSTRAINT "Docentes_sede_id_fkey" FOREIGN KEY ("sede_id") REFERENCES "Sedes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add Foreign Keys for DocenteAsignaciones
ALTER TABLE "DocenteAsignaciones" ADD CONSTRAINT "DocenteAsignaciones_docente_id_fkey" FOREIGN KEY ("docente_id") REFERENCES "Docentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DocenteAsignaciones" ADD CONSTRAINT "DocenteAsignaciones_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "Cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DocenteAsignaciones" ADD CONSTRAINT "DocenteAsignaciones_materia_id_fkey" FOREIGN KEY ("materia_id") REFERENCES "Materias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add Foreign Keys for Estudiantes
ALTER TABLE "Estudiantes" ADD CONSTRAINT "Estudiantes_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "Cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Estudiantes" ADD CONSTRAINT "Estudiantes_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "Instituciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

