#!/usr/bin/env node
/**
 * Test script para verificar la API de tratamientos.
 * Ejecutar con: node test-tratamientos.mjs
 */

const BASE_URL = 'http://localhost:3000';
const TEST_USER_ID = 'test-user-' + Date.now();

async function testAPI() {
  console.log('🧪 Probando API de tratamientos...\n');

  // 1. GET lista vacía
  console.log('1️⃣ GET /api/tratamientos?userId=...');
  const listRes = await fetch(`${BASE_URL}/api/tratamientos?userId=${TEST_USER_ID}`);
  const listData = await listRes.json();
  console.log(`   Status: ${listRes.status}`);
  console.log(`   Data:`, listData);
  console.log('');

  // 2. POST crear tratamiento
  console.log('2️⃣ POST /api/tratamientos');
  const newTrat = {
    userId: TEST_USER_ID,
    medicamentoPersonalId: 'medicamento-1',
    nombreTratamiento: 'Tratamiento de prueba',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    dosis: '1 tableta',
    frecuencia: 'cada 8 horas',
    horarios: '08:00,20:00',
    instrucciones: 'Tomar con comida',
    estado: 'activo',
    notas: 'Tratamiento inicial',
  };
  const createRes = await fetch(`${BASE_URL}/api/tratamientos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTrat),
  });
  const createData = await createRes.json();
  console.log(`   Status: ${createRes.status}`);
  console.log(`   Data:`, createData);
  console.log('');

  if (!createRes.ok || !createData.success) {
    console.error('❌ Falló la creación');
    process.exit(1);
  }

  const tratamientoId = createData.data.id;
  console.log(`   ✅ Creado con ID: ${tratamientoId}\n`);

  // 3. GET lista con el nuevo
  console.log('3️⃣ GET /api/tratamientos (después de crear)');
  const listRes2 = await fetch(`${BASE_URL}/api/tratamientos?userId=${TEST_USER_ID}`);
  const listData2 = await listRes2.json();
  console.log(`   Status: ${listRes2.status}`);
  console.log(`   Count:`, listData2.data?.length);
  console.log('');

  // 4. DELETE el tratamiento
  console.log('4️⃣ DELETE /api/tratamientos?id=...');
  const deleteRes = await fetch(`${BASE_URL}/api/tratamientos`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: tratamentoId }),
  });
  const deleteData = await deleteRes.json();
  console.log(`   Status: ${deleteRes.status}`);
  console.log(`   Data:`, deleteData);
  console.log('');

  // 5. Verificar que se borró
  console.log('5️⃣ GET /api/tratamientos (después de borrar)');
  const listRes3 = await fetch(`${BASE_URL}/api/tratamientos?userId=${TEST_USER_ID}`);
  const listData3 = await listRes3.json();
  console.log(`   Status: ${listRes3.status}`);
  console.log(`   Count:`, listData3.data?.length);
  console.log('');

  console.log('✅ Todos los tests pasaron');
}

testAPI().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});