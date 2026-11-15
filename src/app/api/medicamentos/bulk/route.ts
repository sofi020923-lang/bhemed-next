import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { medicamentos } from '@/lib/schemas';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const CHUNK_SIZE = 500;

type MedicamentoInput = {
  id: string;
  nombreComercial: string;
  nombreGenerico: string;
  principioActivo: string;
  concentracion?: string | null;
  formaFarmaceutica?: string | null;
  laboratorio?: string | null;
  indicaciones?: string | null;
  contraindicaciones?: string | null;
  reaccionesAdversas?: string | null;
  interacciones?: string | null;
  conservacion?: string | null;
  dosisComun?: string | null;
  viaAdministracion?: string | null;
  requiereReceta?: boolean | null;
  descripcionLenguajeSencillo?: string | null;
  fuentesBibliograficas?: string | null;
  fechaActualizacion?: string | null;
};

const REQUIRED = ['id', 'nombreComercial', 'nombreGenerico', 'principioActivo'] as const;

function validateBatch(batch: MedicamentoInput[]): { valid: boolean; error?: string } {
  for (let i = 0; i < batch.length; i++) {
    const m = batch[i];
    for (const field of REQUIRED) {
      const value = m[field];
      if (value === undefined || value === null || String(value).trim() === '') {
        return { valid: false, error: `Índice ${i}: campo obligatorio "${field}" vacío` };
      }
    }
  }
  return { valid: true };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Acepta { data: [...] } o un array directo
    const items: MedicamentoInput[] = Array.isArray(body) ? body : Array.isArray(body.data) ? body.data : null;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Payload debe ser { data: [...] } o un array no vacío' }, { status: 400 });
    }

    const check = validateBatch(items);
    if (!check.valid) {
      return NextResponse.json({ success: false, error: check.error }, { status: 422 });
    }

    let inserted = 0;
    let skipped = 0;

    // Inserción por lotes: id idempotente (re-ejecutar el mismo JSON no duplica filas)
    for (let i = 0; i < items.length; i += CHUNK_SIZE) {
      const chunk = items.slice(i, i + CHUNK_SIZE);
      try {
        await db
          .insert(medicamentos)
          .values(chunk.map((m) => ({
            id: m.id,
            nombreComercial: m.nombreComercial,
            nombreGenerico: m.nombreGenerico,
            principioActivo: m.principioActivo,
            concentracion: m.concentracion || null,
            formaFarmaceutica: m.formaFarmaceutica || null,
            laboratorio: m.laboratorio || null,
            indicaciones: m.indicaciones || null,
            contraindicaciones: m.contraindicaciones || null,
            reaccionesAdversas: m.reaccionesAdversas || null,
            interacciones: m.interacciones || null,
            conservacion: m.conservacion || null,
            dosisComun: m.dosisComun || null,
            viaAdministracion: m.viaAdministracion || null,
            requiereReceta: m.requiereReceta ?? false,
            descripcionLenguajeSencillo: m.descripcionLenguajeSencillo || null,
            fuentesBibliograficas: m.fuentesBibliograficas || null,
            fechaActualizacion: m.fechaActualizacion || new Date().toISOString().slice(0, 10),
          })))
          .onConflictDoUpdate({
            target: medicamentos.id,
            set: { updatedAt: sql`CURRENT_TIMESTAMP` },
          });
        inserted += chunk.length;
      } catch (error) {
        console.error(`Error en lote ${i}..${i + chunk.length}:`, error);
        skipped += chunk.length;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Importación completada: ${inserted} insertados/actualizados, ${skipped} omitidos por error.`,
      inserted,
      skipped,
      total: items.length,
    });
  } catch (error) {
    console.error('Error en importación masiva:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Endpoint de importación masiva de medicamentos. Envía un POST con { data: [...] } o un array.',
  });
}