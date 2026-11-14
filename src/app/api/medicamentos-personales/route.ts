import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { medicamentosPersonales } from '@/lib/schemas';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * GET /api/medicamentos-personales?userId=<uuid>
 *
 * Lista todos los medicamentos personales de un usuario.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    const rows = await db
      .select()
      .from(medicamentosPersonales)
      .where(eq(medicamentosPersonales.userId, userId))
      .orderBy(desc(medicamentosPersonales.createdAt));

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error obteniendo medicamentos personales:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/medicamentos-personales
 *
 * Crea un nuevo medicamento personal.
 * Body JSON:
 * { userId, nombre, principioActivo, concentracion, formaFarmaceutica,
 *   laboratorio, color, notas, fotoUrl }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, ...values } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    const id = randomUUID();

    const [created] = await db
      .insert(medicamentosPersonales)
      .values({
        ...values,
        userId,
        id,
      })
      .returning();

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creando medicamento personal:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/medicamentos-personales?id=<id>&key=<s3Key>
 *
 * Elimina un medicamento personal y opcionalmente su foto de Neon Storage.
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const key = searchParams.get('key');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id es requerido' },
        { status: 400 }
      );
    }

    await db.delete(medicamentosPersonales).where(eq(medicamentosPersonales.id, id));

    // Si hay una key de Neon Storage, borrar el objeto del bucket
    if (key) {
      try {
        const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
        const { storageClient, NEON_STORAGE_BUCKET } = await import('@/lib/storage');
        await storageClient.send(
          new DeleteObjectCommand({ Bucket: NEON_STORAGE_BUCKET, Key: key })
        );
      } catch (err) {
        console.error('No se pudo borrar foto de Neon Storage:', err);
        // No fallamos el delete de la BD por esto
      }
    }

    return NextResponse.json({ success: true, message: 'Medicamento eliminado' });
  } catch (error) {
    console.error('Error eliminando medicamento personal:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
