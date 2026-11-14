import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { medicamentos } from '@/lib/schemas';
import { eq, like, or } from 'drizzle-orm';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';

    let data;
    if (search) {
      const pattern = `%${search}%`;
      data = await db
        .select()
        .from(medicamentos)
        .where(
          or(
            like(medicamentos.nombreComercial, pattern),
            like(medicamentos.nombreGenerico, pattern),
            like(medicamentos.principioActivo, pattern),
            like(medicamentos.concentracion, pattern)
          )
        );
    } else {
      data = await db.select().from(medicamentos);
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error obteniendo medicamentos:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = generateId();
    await db.insert(medicamentos).values({
      id,
      nombreComercial: body.nombreComercial,
      nombreGenerico: body.nombreGenerico,
      principioActivo: body.principioActivo,
      concentracion: body.concentracion,
      formaFarmaceutica: body.formaFarmaceutica,
      laboratorio: body.laboratorio,
      indicaciones: body.indicaciones,
      contraindicaciones: body.contraindicaciones,
      reaccionesAdversas: body.reaccionesAdversas,
      interacciones: body.interacciones,
      conservacion: body.conservacion,
      dosisComun: body.dosisComun,
      viaAdministracion: body.viaAdministracion,
      requiereReceta: body.requiereReceta || false,
      descripcionLenguajeSencillo: body.descripcionLenguajeSencillo,
      fuentesBibliograficas: body.fuentesBibliograficas,
      fechaActualizacion: new Date().toISOString(),
    });
    const data = await db.select().from(medicamentos).where(eq(medicamentos.id, id)).limit(1);
    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creando medicamento:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
