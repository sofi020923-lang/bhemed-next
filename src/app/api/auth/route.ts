import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, sesiones } from '@/lib/schemas';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email y contraseña requeridos' }, { status: 400 });
    }
    // Buscar usuario en SQLite local
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (user.length === 0) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }
    const valid = await bcrypt.compare(password, user[0].passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Contraseña incorrecta' }, { status: 401 });
    }
    // Crear sesión
    const token = generateId();
    const refreshToken = generateId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await db.insert(sesiones).values({ id: generateId(), userId: user[0].id, token, refreshtToken: refreshToken, expiresAt });
    return NextResponse.json({
      success: true,
      data: { user: user[0], token, refreshToken, expiresAt },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { token } = await req.json();
    await db.delete(sesiones).where(eq(sesiones.token, token));
    return NextResponse.json({ success: true, message: 'Sesión cerrada' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al cerrar sesión' }, { status: 500 });
  }
}