import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schemas';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// Perfil de aplicación sincronizado con el usuario de Neon Auth.
// Si el usuario de Auth aún no tiene perfil en la tabla `users`, lo crea a partir
// del nombre registrado en Neon Auth.
async function ensureProfile(authUser: { id: string; email?: string; name?: string }) {
  const existing = await db.select().from(users).where(eq(users.id, authUser.id)).limit(1);
  if (existing.length > 0) return existing[0];

  const nameParts = (authUser.name ?? '').trim().split(/\s+/);
  const nombre = nameParts[0] || 'Usuario';
  const apellido = nameParts.slice(1).join(' ') || '—';
  await db.insert(users).values({
    id: authUser.id,
    email: authUser.email ?? '',
    nombre,
    apellido,
    role: 'paciente',
  });
  const created = await db.select().from(users).where(eq(users.id, authUser.id)).limit(1);
  return created[0];
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email y contraseña requeridos' }, { status: 400 });
    }

    // Autenticación delegada a Neon Auth (Better Auth gestionado). La sesión se
    // establece vía cookie firmada; devolvemos además el token para el store
    // del cliente (contrato existente del frontend).
    // El servicio valida el header Origin: propagamos el origin de la request.
    const origin = req.headers.get('origin') ?? new URL(req.url).origin;
    const { data, error } = await auth.signIn.email({ email, password }, { headers: { origin } });

    if (error || !data) {
      const status = (error as { status?: number })?.status ?? 401;
      const message = status === 404 ? 'Usuario no encontrado' : 'Email o contraseña incorrectos';
      return NextResponse.json({ success: false, error: message }, { status: 401 });
    }

    const session = data as {
      user?: { id: string; email?: string; name?: string };
      token?: string;
      session?: { token?: string; expiresAt?: string };
    };
    const authUser = session.user!;
    const profile = await ensureProfile(authUser);
    const token = session.session?.token ?? session.token ?? '';

    return NextResponse.json({
      success: true,
      data: { user: profile, token, refreshToken: token, expiresAt: session.session?.expiresAt ?? null },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Cierra la sesión en Neon Auth y elimina la cookie firmada
    const { error } = await auth.signOut();
    if (error) {
      return NextResponse.json({ success: false, error: 'Error al cerrar sesión' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Sesión cerrada' });
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json({ success: false, error: 'Error al cerrar sesión' }, { status: 500 });
  }
}
