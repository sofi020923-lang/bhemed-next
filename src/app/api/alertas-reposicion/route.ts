import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { alertasReposicion } from '@/lib/schemas';
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
      .from(alertasReposicion)
      .where(eq(alertasReposicion.userId, userId))
      .orderBy(desc(alertasReposicion.createdAt));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error obteniendo alertas:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, medicamentoPersonalId, stockActual, stockMinimo, fechaAlerta, estado } = body;
    if (!userId || !medicamentoPersonalId) {
      return NextResponse.json({ success: false, error: 'userId y medicamentoPersonalId requeridos' }, { status: 400 });
    }
    const id = randomUUID();
    const [created] = await db.insert(alertasReposicion).values({
      id,
      userId,
      medicamentoPersonalId,
      stockActual: stockActual ?? 0,
      stockMinimo: stockMinimo ?? 5,
      fechaAlerta: fechaAlerta ?? new Date().toISOString(),
      estado: estado ?? 'pendiente',
    }).returning();
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creando alerta:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, estado, stockActual } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'id es requerido' }, { status: 400 });
    }
    await db.update(alertasReposicion).set({
      ...(estado !== undefined ? { estado } : {}),
      ...(stockActual !== undefined ? { stockActual } : {}),
      updatedAt: new Date().toISOString(),
    }).where(eq(alertasReposicion.id, id));
    return NextResponse.json({ success: true, message: 'Alerta actualizada' });
  } catch (error) {
    console.error('Error actualizando alerta:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'id es requerido' }, { status: 400 });
    }
    await db.delete(alertasReposicion).where(eq(alertasReposicion.id, id));
    return NextResponse.json({ success: true, message: 'Alerta eliminada' });
  } catch (error) {
    console.error('Error eliminando alerta:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}