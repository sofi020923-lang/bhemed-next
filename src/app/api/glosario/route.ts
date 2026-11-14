import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { glosario } from '@/lib/schemas';
import { eq } from 'drizzle-orm';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await db.select().from(glosario);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error obteniendo glosario:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = generateId();
    await db.insert(glosario).values({
      id,
      termino: body.termino,
      definicion: body.definicion,
      categoria: body.categoria,
    });
    const data = await db.select().from(glosario).where(eq(glosario.id, id)).limit(1);
    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creando término:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'id es requerido' }, { status: 400 });
    }
    await db.delete(glosario).where(eq(glosario.id, id));
    return NextResponse.json({ success: true, message: 'Término eliminado' });
  } catch (error) {
    console.error('Error eliminando término:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
