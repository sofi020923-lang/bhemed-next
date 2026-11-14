import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, configuracionesUsuario } from '@/lib/schemas';
import { eq, sql } from 'drizzle-orm';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

/**
 * GET /api/perfil?userId=<uuid>
 *
 * Obtiene los datos del perfil del usuario y sus configuraciones.
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

    // Obtener datos del usuario
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (userRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const user = userRows[0];

    // Obtener configuraciones
    const configRows = await db
      .select()
      .from(configuracionesUsuario)
      .where(eq(configuracionesUsuario.userId, userId));

    const configuracion = configRows.length > 0 ? configRows[0] : null;

    return NextResponse.json({
      success: true,
      data: {
        user,
        configuracion,
      },
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/perfil
 *
 * Actualiza datos del perfil del usuario.
 * Body esperado:
 * { userId, nombre, apellido, telefono?, fechaNacimiento? }
 * Opcional: { userId, configuracion: { tema, idioma, notificacionesPush, ... } }
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, nombre, apellido, telefono, fechaNacimiento, configuracion } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    // Actualizar campos del usuario (solo los editables)
    const updateData: any = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (apellido !== undefined) updateData.apellido = apellido;
    if (telefono !== undefined) updateData.telefono = telefono;
    if (fechaNacimiento !== undefined) updateData.fechaNacimiento = fechaNacimiento;

    await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId));

    // Si se envían configuraciones, actualizarlas
    if (configuracion) {
      // Si ya existe, actualizar; si no, crear
      const existing = await db
        .select()
        .from(configuracionesUsuario)
        .where(eq(configuracionesUsuario.userId, userId));

      if (existing.length > 0) {
        await db
          .update(configuracionesUsuario)
          .set({
            ...configuracion,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(configuracionesUsuario.userId, userId));
      } else {
        await db.insert(configuracionesUsuario).values({
          id: generateId(),
          userId,
          ...configuracion,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado correctamente',
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}