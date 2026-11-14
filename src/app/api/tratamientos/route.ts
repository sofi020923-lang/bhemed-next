import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tratamientos, historialDosis, recordatorios } from '@/lib/schemas';
import { eq, desc } from 'drizzle-orm';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const query = db.select().from(tratamientos);
    const data = userId
      ? await query.where(eq(tratamientos.userId, userId)).orderBy(desc(tratamientos.createdAt))
      : await query.orderBy(desc(tratamientos.createdAt));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error obteniendo tratamientos:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = generateId();
    await db.insert(tratamientos).values({
      id,
      userId: body.userId,
      medicamentoPersonalId: body.medicamentoPersonalId,
      nombreTratamiento: body.nombreTratamiento,
      fechaInicio: body.fechaInicio,
      fechaFin: body.fechaFin,
      dosis: body.dosis,
      frecuencia: body.frecuencia,
      horarios: body.horarios,
      instrucciones: body.instrucciones,
      estado: body.estado || 'activo',
      notas: body.notas,
      creadoPor: body.creadoPor,
    });
    const data = await db.select().from(tratamientos).where(eq(tratamientos.id, id)).limit(1);
    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creando tratamiento:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await db.update(tratamientos).set({
      nombreTratamiento: body.nombreTratamiento,
      fechaInicio: body.fechaInicio,
      fechaFin: body.fechaFin,
      dosis: body.dosis,
      frecuencia: body.frecuencia,
      horarios: body.horarios,
      instrucciones: body.instrucciones,
      estado: body.estado,
      notas: body.notas,
      updatedAt: new Date().toISOString(),
    }).where(eq(tratamientos.id, body.id));
    return NextResponse.json({ success: true, message: 'Tratamiento actualizado' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.delete(tratamientos).where(eq(tratamientos.id, id));
    await db.delete(historialDosis).where(eq(historialDosis.tratamientoId, id));
    await db.delete(recordatorios).where(eq(recordatorios.tratamientoId, id));
    return NextResponse.json({ success: true, message: 'Tratamiento eliminado' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
