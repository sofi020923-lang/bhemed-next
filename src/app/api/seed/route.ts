import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, medicamentos, glosario, tratamientos, recordatorios, historialDosis } from '@/lib/schemas';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Seed de datos de ejemplo
    const usersCount = await db.select().from(users);
    if (usersCount.length === 0) {
      await db.insert(users).values({
        id: generateId(),
        email: 'demo@bhemed.app',
        nombre: 'Demo',
        apellido: 'Usuario',
        role: 'paciente',
        passwordHash: '$2a$10$demo',
      });
    }
    const medsCount = await db.select().from(medicamentos);
    if (medsCount.length === 0) {
      await db.insert(medicamentos).values([
        { id: generateId(), nombreComercial: 'Paracetamol', nombreGenerico: 'Paracetamol', principioActivo: 'Paracetamol', concentracion: '500mg', formaFarmaceutica: 'Tableta', laboratorio: 'Genérico', indicaciones: 'Alivio del dolor leve a moderado y reducción de la fiebre.', contraindicaciones: 'Hipersensibilidad al paracetamol, insuficiencia hepática grave.', reaccionesAdversas: 'Generalmente bien tolerado.', interacciones: 'Alcohol, anticoagulantes.', conservacion: 'Conservar a temperatura ambiente (15-30°C).', requiereReceta: false, descripcionLenguajeSencillo: 'Es un medicamento común para aliviar el dolor y la fiebre.', fuentesBibliograficas: '["WHO", "FDA"]', fechaActualizacion: '2024-01-15' },
        { id: generateId(), nombreComercial: 'Ibuprofeno', nombreGenerico: 'Ibuprofeno', principioActivo: 'Ibuprofeno', concentracion: '400mg', formaFarmaceutica: 'Tableta', laboratorio: 'Varios', indicaciones: 'Dolor leve a moderado, inflamación, fiebre.', contraindicaciones: 'Úlcera péptica, insuficiencia renal grave.', reaccionesAdversas: 'Malestar estomacal, náuseas.', interacciones: 'Anticoagulantes, AAS.', conservacion: 'Conservar a temperatura ambiente (15-30°C).', requiereReceta: false, descripcionLenguajeSencillo: 'Antiinflamatorio que ayuda a reducir dolor, fiebre e inflamación.', fuentesBibliograficas: '["WHO", "EMA"]', fechaActualizacion: '2024-02-20' },
        { id: generateId(), nombreComercial: 'Amoxicilina', nombreGenerico: 'Amoxicilina', principioActivo: 'Amoxicilina', concentracion: '500mg', formaFarmaceutica: 'Cápsula', laboratorio: 'Varios', indicaciones: 'Infecciones bacterianas.', contraindicaciones: 'Alergia a penicilinas.', reaccionesAdversas: 'Reacciones alérgicas, diarrea.', interacciones: 'Probenecid, metotrexato.', conservacion: 'Conservar a temperatura ambiente.', requiereReceta: true, descripcionLenguajeSencillo: 'Antibiótico para tratar infecciones de bacterias.', fuentesBibliograficas: '["WHO", "FDA"]', fechaActualizacion: '2024-03-10' },
      ]);
    }
    const glosCount = await db.select().from(glosario);
    if (glosCount.length === 0) {
      await db.insert(glosario).values([
        { id: generateId(), termino: 'Principio activo', definicion: 'Sustancia activa de un medicamento responsable de su efecto terapéutico.', categoria: 'concepto' },
        { id: generateId(), termino: 'Forma farmacéutica', definicion: 'Presentación física y química de un medicamento.', categoria: 'concepto' },
        { id: generateId(), termino: 'Reacción adversa', definicion: 'Efecto no deseado o perjudicial que puede ocurrir tras la administración de un medicamento.', categoria: 'efecto' },
        { id: generateId(), termino: 'Contraindicación', definicion: 'Condición en la que no se debe administrar un medicamento.', categoria: 'efecto' },
      ]);
    }
    return NextResponse.json({ success: true, message: 'Datos de ejemplo insertados correctamente' });
  } catch (error) {
    console.error('Error en seed:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
