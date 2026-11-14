import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schemas';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();
    if (!email || !newPassword) {
      return NextResponse.json({ success: false, error: 'Email y nueva contraseña requeridos' }, { status: 400 });
    }
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (user.length === 0) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ passwordHash, updatedAt: new Date().toISOString() }).where(eq(users.id, user[0].id));
    return NextResponse.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error en recuperación:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
