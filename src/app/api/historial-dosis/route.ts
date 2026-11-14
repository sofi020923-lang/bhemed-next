import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { historialDosis } from '@/lib/schemas';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId es requerido' }, { status: 400 });
    }
    const data = await db
      .select()
      .from(historialDosis)
      .where(eq(historialDosis.userId, userId))
      .orderBy(desc(historialDosis.fechaHora));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, tratamientoId, fechaHora, dosisTomada, estado, notas } = body;
    if (!userId || !tratamientoId) {
      return NextResponse.json({ success: false, error: 'userId y tratamientoId requeridos' }, { status: 400 });
    }
    const id = randomUUID();
    const [created] = await db.insert(historialDosis).values({
      id,
      userId,
      tratamientoId,
      fechaHora: fechaHora ?? new Date().toISOString(),
      dosisTomada: dosisTomada ?? null,
      estado: estado ?? 'tomada',
      notas: notas ?? null,
    }).returning();
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creando historial:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}