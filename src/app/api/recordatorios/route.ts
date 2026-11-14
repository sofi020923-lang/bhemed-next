import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recordatorios } from '@/lib/schemas';
import { eq, desc } from 'drizzle-orm';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const query = db.select().from(recordatorios);
    const data = userId
      ? await query.where(eq(recordatorios.userId, userId)).orderBy(desc(recordatorios.fechaHora))
      : await query;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error obteniendo recordatorios:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = generateId();
    await db.insert(recordatorios).values({
      id,
      userId: body.userId,
      tratamientoId: body.tratamientoId,
      fechaHora: body.fechaHora,
      tipo: body.tipo || 'medicamento',
      estado: body.estado || 'pendiente',
      notificado: body.notificado || false,
    });
    const data = await db.select().from(recordatorios).where(eq(recordatorios.id, id)).limit(1);
    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creando recordatorio:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await db.update(recordatorios).set({
      estado: body.estado,
      notificado: body.notificado,
      updatedAt: new Date().toISOString(),
    }).where(eq(recordatorios.id, body.id));
    return NextResponse.json({ success: true, message: 'Recordatorio actualizado' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.delete(recordatorios).where(eq(recordatorios.id, id));
    return NextResponse.json({ success: true, message: 'Recordatorio eliminado' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
