import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    // Neon Auth inicia el flujo de recuperación (Better Auth request-password-reset).
    // La respuesta es genérica para no revelar si el email existe o no.
    // NOTA: la entrega del email depende del SMTP configurado en Neon Auth
    // (Console → Auth → Settings). Sin SMTP, el flujo se registra pero no envía correo.
    // El servicio valida el header Origin: propagamos el origin de la request.
    const origin = req.headers.get('origin') ?? new URL(req.url).origin;
    await auth.requestPasswordReset(
      { email, redirectTo: `${origin}/auth/recover` },
      { headers: { origin } }
    );

    return NextResponse.json({
      success: true,
      message: 'Si el email está registrado, recibirás un enlace para restablecer la contraseña',
    });
  } catch (error) {
    console.error('Error en recuperación:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
