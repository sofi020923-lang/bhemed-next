// Carga el dataset completo de medicamentos INVIMA Colombia en Neon PostgreSQL
// Uso: DATABASE_URL="..." node scripts/import-invima-to-db.mjs
// Requisitos: archivo data/medicamentos.json generado por `node scripts/import-invima.mjs`

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const raw = readFileSync('.env.local', 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*DATABASE_URL\s*=\s*"?([^"\n#]+)"?\s*$/);
      if (m) return m[1].trim();
    }
  } catch {}
  throw new Error('DATABASE_URL no encontrada. Ejecuta `neon deploy` o exporta DATABASE_URL.');
}

const CHUNK_SIZE = 500;

const COLUMNS = [
  'id','nombre_comercial','nombre_generico','principio_activo','concentracion',
  'forma_farmaceutica','laboratorio','indicaciones','contraindicaciones',
  'reacciones_adversas','interacciones','conservacion','dosis_comun',
  'via_administracion','requiere_receta','descripcion_lenguaje_sencillo',
  'fuentes_bibliograficas','fecha_actualizacion'
];

const UPDATE_SET = COLUMNS
  .filter(c => c !== 'id')
  .map(c => `${c} = EXCLUDED.${c}`)
  .join(', ');

function toValue(v, column) {
  if (column === 'requiere_receta') return !!v;
  if (v === undefined || v === null) return null;
  const s = String(v);
  return s === '' ? null : s;
}

async function main() {
  const sql = neon(databaseUrl());

  const data = JSON.parse(readFileSync('./data/medicamentos.json', 'utf8'));
  console.log(`📦 Dataset cargado: ${data.length} medicamentos`);

  console.log('🗑️  Limpiando tabla medicamentos...');
  await sql.query('DELETE FROM medicamentos');
  console.log('✅ Tabla limpiada.');

  let inserted = 0;
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    // construir query parametrizada: ($1..$N), ($N+1..$2N) ...
    const params = [];
    const rows = [];
    for (const m of chunk) {
      const values = [
        m.id, m.nombreComercial, m.nombreGenerico, m.principioActivo, m.concentracion,
        m.formaFarmaceutica, m.laboratorio, m.indicaciones, m.contraindicaciones,
        m.reaccionesAdversas, m.interacciones, m.conservacion, m.dosisComun,
        m.viaAdministracion, m.requiereReceta, m.descripcionLenguajeSencillo,
        m.fuentesBibliograficas, m.fechaActualizacion,
      ].map((v, idx) => toValue(v, COLUMNS[idx]));
      const base = params.length;
      const placeholders = values.map((_, idx) => `$${base + idx + 1}`).join(', ');
      rows.push(`(${placeholders})`);
      params.push(...values);
    }
    const query = `INSERT INTO medicamentos (${COLUMNS.join(', ')}) VALUES ${rows.join(', ')} ON CONFLICT (id) DO UPDATE SET ${UPDATE_SET}`;
    try {
      await sql.query(query, params);
      inserted += chunk.length;
      process.stdout.write(`\r✅ Insertados: ${inserted}/${data.length}`);
    } catch (error) {
      console.error(`\n❌ Error en lote ${i}..${i + chunk.length}:`, error);
      process.exit(1);
    }
  }

  const rowsCount = await sql.query('SELECT count(*)::int AS count FROM medicamentos');
  console.log(`\n🎉 Carga completada: ${rowsCount[0].count} medicamentos en la base de datos.`);

  const testTerms = ['omeprazol', 'montelukast', 'salbutamol', 'paracetamol', 'amoxicilina'];
  for (const term of testTerms) {
    const results = await sql.query(
      `SELECT count(*)::int AS count FROM medicamentos
       WHERE LOWER(nombre_comercial) LIKE $1 OR LOWER(nombre_generico) LIKE $1 OR LOWER(principio_activo) LIKE $1`,
      [`%${term}%`]
    );
    console.log(`🔍 "${term}": ${results[0].count} resultados`);
  }
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
