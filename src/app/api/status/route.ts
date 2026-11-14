import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API de BHEMED funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      medicamentos: '/api/medicamentos',
      tratamientos: '/api/tratamientos',
      recordatorios: '/api/recordatorios',
      glosario: '/api/glosario',
      seed: '/api/seed',
    },
  });
}
