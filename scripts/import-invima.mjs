// Importador de medicamentos colombianos desde INVIMA (Datos Abiertos Colombia)
// Uso: node scripts/import-invima.mjs [--limit=N] [--output=archivo.json]
//
// Fuente: https://www.datos.gov.co/Salud-y-Protecci-n-Social/C-DIGO-NICO-DE-MEDICAMENTOS-VIGENTES/i7cb-raxc
// Dataset: CÓDIGO ÚNICO DE MEDICAMENTOS VIGENTES (INVIMA) — ~121K registros activos

const BASE_URL = 'https://www.datos.gov.co/resource/i7cb-raxc.json';
const BATCH = 5000; // máximo por página en Socrata

import { dirname } from 'node:path';
import { mkdirSync, writeFileSync, statSync } from 'node:fs';

const SELECT = [
  'expediente', 'producto', 'titular', 'registrosanitario',
  'estadoregistro', 'estadocum', 'atc', 'descripcionatc',
  'viaadministracion', 'principioactivo', 'cantidad', 'unidadmedida',
  'formafarmaceutica', 'unidadreferencia', 'muestramedica',
  'descripcioncomercial', 'fechaactivo', 'fechainactivo'
].join(',');

function soql(where, offset, limit) {
  const params = new URLSearchParams({
    $select: SELECT,
    $where: where,
    $limit: String(limit),
    $offset: String(offset),
  });
  return `${BASE_URL}?${params.toString()}`;
}

async function fetchAll({ where = "estadocum='Activo'", maxRows = Infinity, onProgress } = {}) {
  const rows = [];
  let offset = 0;
  for (;;) {
    const limit = Math.min(BATCH, Math.max(1, maxRows - rows.length));
    const url = soql(where, offset, limit);
    const res = await fetch(url, { headers: { 'User-Agent': 'BHEMED-import/1.0' } });
    if (!res.ok) throw new Error(`INVIMA HTTP ${res.status}: ${await res.text()}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    rows.push(...batch);
    offset += batch.length;
    onProgress?.(rows.length, batch.length);
    if (batch.length < limit || rows.length >= maxRows) break;
    // cortesía hacia la API pública
    await new Promise(r => setTimeout(r, 250));
  }
  return rows;
}

// --- Normalización al esquema de BHEMED (tabla `medicamentos`) ---

function cleanText(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

// Extrae el nombre base del principio activo eliminando cantidades p.ej.
// "1000 ML DE SOLUCION CONTIENEN: ISOLEUCINA" -> "ISOLEUCINA"
// "10.4 MG DE MONTELUKAST SODICO EQUIVALENTE A MONTELUKAST" -> "MONTELUKAST SODICO"
function baseActiveIngredient(pa) {
  if (!pa) return '';
  let s = cleanText(pa).toUpperCase();
  // patrón "X MG DE <NOMBRE> ..." o "X G DE ..." o "... CONTIENEN: <NOMBRE>"
  const m = s.match(/(?:CONTIENEN?:\s*|DE\s+)([A-ZÑÁÉÍÓÚÜ ]+?)(?:\s+EQ?\w*|\s+EQUIVALENTE|\s+DE\s+|\s*$)/);
  if (m && m[1]) s = m[1];
  // limpiar prefijos numéricos residuales
  s = s.replace(/^[\d.,\s]+(MG|G|ML|MCG|UI|U)\b\s*/i, '').trim();
  return s || cleanText(pa);
}

function buildConcentracion(row) {
  const cant = row.cantidad;
  const u = row.unidadmedida;
  if (cant === null || cant === undefined || cant === '') return '';
  return `${cant}${u ? ' ' + u : ''}`;
}

function toBhemed(row, idx) {
  const pa = cleanText(row.principioactivo);
  const base = baseActiveIngredient(pa);
  const atc = cleanText(row.atc);
  const descATC = cleanText(row.descripcionatc);

  // Nombre comercial: usar el producto; si es muy largo (descripción institucional), recortar
  let nombreComercial = cleanText(row.producto) || `${base} ${buildConcentracion(row)}`.trim();

  // indicaciones base desde ATC (contexto farmacológico, NO sustituye ficha técnica)
  let indicaciones = descATC
    ? `Grupo farmacológico ATC ${atc}: ${descATC}. Consultar indicaciones aprobadas por INVIMA en el registro sanitario ${cleanText(row.registrosanitario)}.`
    : `Consultar indicaciones aprobadas por INVIMA en el registro sanitario ${cleanText(row.registrosanitario)}.`;

  const hoy = new Date().toISOString().slice(0, 10);

  return {
    id: crypto.randomUUID(),
    nombreComercial,
    nombreGenerico: base,
    principioActivo: base || pa,
    concentracion: buildConcentracion(row),
    formaFarmaceutica: cleanText(row.formafarmaceutica),
    laboratorio: cleanText(row.titular),
    indicaciones,
    contraindicaciones: 'No disponible en fuente abierta. Verificar en ficha técnica INVIMA / prospecto del fabricante.',
    reaccionesAdversas: 'No disponible en fuente abierta. Verificar en ficha técnica INVIMA / prospecto del fabricante.',
    interacciones: 'No disponible en fuente abierta. Verificar en ficha técnica INVIMA / prospecto del fabricante.',
    conservacion: 'Según instrucciones del fabricante (ver prospecto).',
    dosisComun: 'Según prescripción médica. Ver ficha técnica INVIMA.',
    viaAdministracion: cleanText(row.viaadministracion),
    requiereReceta: cleanText(row.muestramedica) === 'Si',
    descripcionLenguajeSencillo: descATC
      ? `Medicamento que contiene ${base || pa}. Pertenece al grupo ATC ${atc} (${descATC}).`
      : `Medicamento que contiene ${base || pa}.`,
    fuentesBibliograficas: JSON.stringify([
      'INVIMA — Datos Abiertos Colombia: Código Único de Medicamentos Vigentes (i7cb-raxc)',
      `Registro sanitario ${cleanText(row.registrosanitario)}`,
    ]),
    fechaActualizacion: hoy,
    _meta: {
      expediente: cleanText(row.expediente),
      registrosanitario: cleanText(row.registrosanitario),
      cum: cleanText(row.expedientecum),
      atc,
      descripcionAtc: descATC,
      estadoCum: cleanText(row.estadocum),
      estadoRegistro: cleanText(row.estadoregistro),
      fechaActivo: cleanText(row.fechaactivo),
      via: cleanText(row.viaadministracion),
      unidadReferencia: cleanText(row.unidadreferencia),
    },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name, def) => {
    const a = args.find(x => x.startsWith(`--${name}=`));
    return a ? a.split('=')[1] : def;
  };
  const where = getArg('where', "estadocum='Activo'");
  const maxRows = parseInt(getArg('limit', '1000000'), 10);
  const outJson = getArg('output', 'data/medicamentos-invima.json');
  const dedupe = getArg('dedupe', 'principioActivo'); // 'none' | 'principioActivo'

  console.log('=== BHEMED · Importador INVIMA (Datos Abiertos Colombia) ===');
  console.log(`Filtro: ${where}`);
  console.log(`Límite: ${maxRows.toLocaleString('es-CO')} filas`);

  const rows = await fetchAll({ where, maxRows, onProgress: (total, last) => {
    process.stdout.write(`\rDescargadas ${total.toLocaleString('es-CO')} filas...`);
  } });
  console.log(`\nTotal filas INVIMA: ${rows.length.toLocaleString('es-CO')}`);

  const meds = rows.map(toBhemed);

  let finalMeds = meds;
  if (dedupe === 'principioActivo') {
    const seen = new Set();
    finalMeds = meds.filter(m => {
      const k = m.principioActivo.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    console.log(`Deduplicadas por principio activo: ${finalMeds.length.toLocaleString('es-CO')} principios activos únicos (de ${meds.length.toLocaleString('es-CO')} registros).`);
  }

  // escribir JSON
  const fs = await import('fs');
  const outDir = dirname(outJson);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outJson, JSON.stringify(finalMeds, null, 2));
  console.log(`Dataset escrito en: ${outJson} (${(fs.statSync(outJson).size / 1024 / 1024).toFixed(2)} MB)`);

  // escribir CSV COPY-ready (CSV con tabuladores) para importar masivamente en PostgreSQL
  const csvPath = outJson.replace(/\.json$/, '.csv');
  const header = [
    'id','nombre_comercial','nombre_generico','principio_activo','concentracion',
    'forma_farmaceutica','laboratorio','indicaciones','contraindicaciones',
    'reacciones_adversas','interacciones','conservacion','dosis_comun',
    'via_administracion','requiere_receta','descripcion_lenguaje_sencillo',
    'fuentes_bibliograficas','fecha_actualizacion'
  ];
  const esc = v => {
    if (v === null || v === undefined) return '\\N';
    const s = String(v);
    if (s === '') return '\\N';
    return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
  };
  const lines = [header.join('\t')];
  for (const m of finalMeds) {
    lines.push([
      m.id, m.nombreComercial, m.nombreGenerico, m.principioActivo, m.concentracion,
      m.formaFarmaceutica, m.laboratorio, m.indicaciones, m.contraindicaciones,
      m.reaccionesAdversas, m.interacciones, m.conservacion, m.dosisComun,
      m.viaAdministracion, m.requiereReceta, m.descripcionLenguajeSencillo,
      m.fuentesBibliograficas, m.fechaActualizacion,
    ].map(esc).join('\t'));
  }
  fs.writeFileSync(csvPath, lines.join('\n') + '\n');
  console.log(`CSV (COPY) escrito en: ${csvPath}`);

  console.log('\nPara insertar en Neon PostgreSQL:');
  console.log(`  psql "$DATABASE_URL" -c "\\copy medicamentos(id,nombre_comercial,nombre_generico,principio_activo,concentracion,forma_farmaceutica,laboratorio,indicaciones,contraindicaciones,reacciones_adversas,interacciones,conservacion,dosis_comun,via_administracion,requiere_receta,descripcion_lenguaje_sencillo,fuentes_bibliograficas,fecha_actualizacion) FROM '${csvPath}' WITH (FORMAT csv, DELIMITER E'\\t', HEADER true)"`);
}

main().catch(err => { console.error(err); process.exit(1); });
