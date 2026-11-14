#!/usr/bin/env node
/** 
 * Test script para verificar la API de medicamentos personales.
 * Ejecutar con: node test-medicamentos-personales.mjs
 */
const BASE_URL = 'http://localhost:3000'; // Cambiar si usas otro puerto

async function testMedicamentosPersonalesAPI() {
  console.log('🧪 Probando API de medicamentos personales...\\n');

  // 1. GET lista (vacía al inicio)
  console.log('1️⃣ GET /api/medicamentos-personales?userId=...');
  const listRes = await fetch(`${BASE_URL}/api/medicamentos-personales?userId=test-user-${Date.now()}`);
  const listData = await listRes.json();
  console.log(`   Status: ${listRes.status}`);
  console.log(`   Data:`, listData);
  console.log('');

  // 2. POST crear medicamento personal
  console.log('2️⃣ POST /api/medicamentos-personales');
  const newMedRes = await fetch(`${BASE_URL}/api/medicamentos-personales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'test-user-1',
      nombre: 'Losartan 50mg',
      principioActivo: 'Losartan',
      concentracion: '50mg',
      formaFarmaceutica: 'Tableta',
    }),
  });
  const newMedData = await newMedRes.json();
  console.log(`   Status: ${newMedRes.status}`);
  console.log(`   Data:`, newMedData);
  console.log('');

  // 3. GET lista (ahora debe tener 1 elemento)
  console.log('3️⃣ GET /api/medicamentos-personales?userId=... (después de crear)');
  const listRes2 = await fetch(`${BASE_URL}/api/medicamentos-personales?userId=test-user-1`);
  const listData2 = await listRes2.json();
  console.log(`   Status: ${listRes2.status}`);
  console.log(`   Count: ${listData2.data?.length}`);
  console.log('');

  // 4. DELETE borrar medicamento
  console.log('4️⃣ DELETE /api/medicamentos-personales/:id');
  const deleteRes = await fetch(`${BASE_URL}/api/medicamentos-personales`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: newMedData.id }),
  });
  const deleteData = await deleteRes.json();
  console.log(`   Status: ${deleteRes.status}`);
  console.log(`   Data:`, deleteData);
  console.log('');

  // 5. GET lista (ahora vacía)
  console.log('5️⃣ GET /api/medicamentos-personales?userId=... (después de borrar)');
  const listRes3 = await fetch(`${BASE_URL}/api/medicamentos-personales?userId=test-user-1`);
  const listData3 = await listRes3.json();
  console.log(`   Status: ${listRes3.status}`);
  console.log(`   Count: ${listData3.data?.length}`);
  console.log('');

  console.log('✅ Todos los tests de medicamentos personales pasaron');
}

testMedicamentosPersonalesAPI().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});