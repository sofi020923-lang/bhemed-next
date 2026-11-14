import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { perfilesDependientes } from '@/lib/schemas';
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
      .from(perfilesDependientes)
      .where(eq(perfilesDependientes.userId, userId))
      .orderBy(desc(perfilesDependientes.createdAt));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error obteniendo dependientes:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, nombreDependiente, relacion, fechaNacimiento, notasMedicas, permisos } = body;
    if (!userId || !nombreDependiente) {
      return NextResponse.json({ success: false, error: 'userId y nombreDependiente requeridos' }, { status: 400 });
    }
    const id = randomUUID();
    const [created] = await db.insert(perfilesDependientes).values({
      id,
      userId,
      nombreDependiente,
      relacion: relacion ?? null,
      fechaNacimiento: fechaNacimiento ?? null,
      notasMedicas: notasMedicas ?? null,
      permisos: permisos ?? null,
      activo: true,
    }).returning();
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creando dependiente:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nombreDependiente, relacion, fechaNacimiento, notasMedicas, permisos, activo } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'id es requerido' }, { status: 400 });
    }
    await db.update(perfilesDependientes).set({
      ...(nombreDependiente !== undefined ? { nombreDependiente } : {}),
      ...(relacion !== undefined ? { relacion } : {}),
      ...(fechaNacimiento !== undefined ? { fechaNacimiento } : {}),
      ...(notasMedicas !== undefined ? { notasMedicas } : {}),
      ...(permisos !== undefined ? { permisos } : {}),
      ...(activo !== undefined ? { activo } : {}),
      updatedAt: new Date().toISOString(),
    }).where(eq(perfilesDependientes.id, id));
    return NextResponse.json({ success: true, message: 'Dependiente actualizado' });
  } catch (error) {
    console.error('Error actualizando dependiente:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'id es requerido' }, { status: 400 });
    }
    await db.delete(perfilesDependientes).where(eq(perfilesDependientes.id, id));
    return NextResponse.json({ success: true, message: 'Dependiente eliminado' });
  } catch (error) {
    console.error('Error eliminando dependiente:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}