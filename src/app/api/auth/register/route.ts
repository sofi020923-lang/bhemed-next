import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schemas';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password, nombre, apellido, telefono, fechaNacimiento } = await req.json();
    if (!email || !password || !nombre || !apellido) {
      return NextResponse.json({ success: false, error: 'Campos requeridos: email, password, nombre, apellido' }, { status: 400 });
    }

    // El registro de credenciales lo gestiona Neon Auth (Better Auth gestionado).
    // El servicio valida el header Origin: propagamos el origin de la request.
    const origin = req.headers.get('origin') ?? new URL(req.url).origin;
    const { data, error } = await auth.signUp.email(
      { email, password, name: `${nombre} ${apellido}`.trim() },
      { headers: { origin } }
    );

    if (error || !data) {
      const status = (error as { status?: number })?.status ?? 500;
      const message =
        status === 409 || status === 422
          ? 'El email ya está registrado'
          : status === 400
            ? 'Datos de registro inválidos'
            : 'Error interno del servidor';
      return NextResponse.json({ success: false, error: message }, { status: status === 409 || status === 422 ? 409 : 400 });
    }

    const authUser = (data as { user?: { id: string; email?: string } }).user!;

    // Perfil de aplicación (tabla `users`) ligado al id del usuario de Neon Auth
    const existingProfile = await db.select().from(users).where(eq(users.id, authUser.id)).limit(1);
    if (existingProfile.length === 0) {
      await db.insert(users).values({
        id: authUser.id,
        email: authUser.email ?? email,
        nombre,
        apellido,
        telefono,
        fechaNacimiento,
        role: 'paciente',
      });
    }
    const profile = await db.select().from(users).where(eq(users.id, authUser.id)).limit(1);
    return NextResponse.json({ success: true, data: { user: profile[0] } }, { status: 201 });
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
