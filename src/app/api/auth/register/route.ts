import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schemas';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password, nombre, apellido, telefono, fechaNacimiento } = await req.json();
    if (!email || !password || !nombre || !apellido) {
      return NextResponse.json({ success: false, error: 'Campos requeridos: email, password, nombre, apellido' }, { status: 400 });
    }
    // Verificar si ya existe
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'El email ya está registrado' }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const id = generateId();
    await db.insert(users).values({
      id,
      email,
      passwordHash,
      nombre,
      apellido,
      telefono,
      fechaNacimiento,
      role: 'paciente',
    });
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return NextResponse.json({ success: true, data: { user: user[0] } }, { status: 201 });
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
