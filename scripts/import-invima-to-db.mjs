// Carga el dataset completo de medicamentos INVIMA Colombia en Neon PostgreSQL
// Uso: DATABASE_URL="..." node scripts/import-invima-to-db.mjs
// Requiere: @neondatabase/serverless + drizzle-orm (ya en node_modules)

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { readFileSync } from 'fs';
import { medicamentos } from './src/lib/schemas.ts';

function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  throw new Error('DATABASE_URL no está definida. Ejecuta `neon deploy` y configura .env.local.');
}

const CHUNK_SIZE = 500;

async function main() {
  const ds = neon(databaseUrl());
  const db = drizzle(ds, { schema: { medicamentos } });

  // 1) Cargar dataset
  const data = JSON.parse(readFileSync('./data/medicamentos.json', 'utf8'));
  console.log(`📦 Dataset cargado: ${data.length} medicamentos`);

  // 2) Limpiar tabla existente (opcional, para evitar duplicados)
  console.log('🗑️  Limpiando tabla medicamentos...');
  await db.delete(medicamentos);
  console.log('✅ Tabla limpiada.');

  // 3) Insertar en lotes de 500
  let inserted = 0;
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE).map((m) => ({
      id: m.id,
      nombreComercial: m.nombreComercial,
      nombreGenerico: m.nombreGenerico,
      principioActivo: m.principioActivo,
      concentracion: m.concentracion || null,
      formaFarmaceutica: m.formaFarmaceutica || null,
      laboratorio: m.laboratorio || null,
      indicaciones: m.indicaciones || null,
      contraindicaciones: m.contraindicaciones || null,
      reaccionesAdversas: m.reaccionesAdversas || null,
      interacciones: m.interacciones || null,
      conservacion: m.conservacion || null,
      dosisComun: m.dosisComun || null,
      viaAdministracion: m.viaAdministracion || null,
      requiereReceta: m.requiereReceta ?? false,
      descripcionLenguajeSencillo: m descripcionLenguajeSencillo || null,
      fuentesBibliograficas: m.fuentesBibliograficas || null,
      fechaActualizacion: m.fechaActualizacion || new Date().toISOString().slice(0, 10),
    }));
    try {
      await db.insert(medicamentos).values(chunk);
      inserted += chunk.length;
      process.stdout.write(`\r✅ Insertados: ${inserted}/${data.length}`);
    } catch (error) {
      console.error(`\n❌ Error en lote ${i}..${i + chunk.length}:`, error);
      process.exit(1);
    }
  }

  // 4) Verificar conteo
  const count = await db.select().from(medicamentos);
  console.log(`\n🎉 Carga completada: ${count.length} medicamentos en la base de datos.`);

  // 5) Probar búsqueda de medicamentos comunes
  const testTerms = ['omeprazol', 'montelukast', 'salbutamol', 'paracetamol'];
  for (const term of testTerms) {
    const results = await db
      .select()
      .from(medicamentos)
      .where(sql`LOWER(${medicamentos.nombreComercial}) LIKE ${'%' + term + '%'} OR LOWER(${medicamentos.nombreGenerico}) LIKE ${'%' + term + '%'} OR LOWER(${medicamentos.principioActivo}) LIKE ${'%' + term + '%'}`);
    console.log(`🔍 "${term}": ${results.length} resultados`);
  }
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});