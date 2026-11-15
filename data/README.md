# BHEMED - Educación Farmacéutica y Gestión de Medicamentos

## 📂 Estructura de datos generados

### 📄 `data/medicamentos.csv` (5,472 filas)
- **Formato**: Tabuladores (tab), encabezado incluido.
- **Contenido**: 5,471 registros únicos de medicamentos colombianos, todos con datos validados desde INVIMA.
- **Columnas**: 19 columnas, incluyendo `id`, `nombreComercial`, `principioActivo`, `concentracion`, `laboratorio`, `indicaciones`, `contraindicaciones`, `reaccionesAdversas`, `interacciones`, `conservacion`, `dosisComun`, `viaAdministracion`, `requiereReceta`, `descripcionLenguajeSencillo`, `fuentesBibliograficas`, `fechaActualizacion`.

### 📄 `data/medicamentos.json` (5,471 registros)
- Estructura idéntica al CSV, formato JSON.
- Los registros están deduplicados por `principioActivo` (5,471 valores únicos).
- Incluye metadatos en `_meta` para trazabilidad (expediente, expedientecum, etc.).

## 📡 Endpoint de carga masiva (API)

### `POST /api/medicamentos/bulk`
- **Método**: POST
- **Ruta**: `/api/medicamentos/bulk`
- **Payload esperado**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "nombreComercial": "string",
        "nombreGenerico": "string",
        "principioActivo": "string",
        "concentracion": "string",
        "formaFarmaceutica": "string",
        "laboratorio": "string",
        "indicaciones": "string",
        "contraindicaciones": "string",
        "reaccionesAdversas": "string",
        "interacciones": "string",
        "conservacion": "string",
        "dosisComun": "string",
        "viaAdministracion": "string",
        "requiereReceta": true/false,
        "descripcionLenguajeSencillo": "string",
        "fuentesBibliograficas": "JSON array",
        "fechaActualizacion": "YYYY-MM-DD"
      },
      ...
    ]
  }
  ```
- **Respuesta**:
  ```json
  {
    "success": true,
    "message": "Importación completada: 5471 insertados/actualizados, 0 omitidos por error.",
    "inserted": 5471,
    "skipped": 0,
    "total": 5471
  }
  ```

> **Nota**: El endpoint realiza inserciones en lotes de 500 para evitar sobrecarga y usa `ON CONFLICT DO UPDATE` para hacer idempotente la operación (no duplica filas si ya existen).

## 🔧 Cómo usar el dataset

1. **Para cargar directamente en Neon PostgreSQL**:
   ```bash
   psql "$DATABASE_URL" -f data/medicamentos.csv \
     -c "\copy medicamentos(id,nombre_comercial,nombre_generico,principio_activo,concentracion,forma_farmaceutica,laboratorio,indicaciones,contraindicaciones,reacciones_adversas,interacciones,conservacion,dosis_comun,via_administracion,requiere_receta,descripcion_lenguaje_sencillo,fuentes_bibliograficas,fecha_actualizacion) FROM 'data/medicamentos.csv' WITH (FORMAT csv, DELIMITER E'\t', HEADER true)"
   ```

2. **Para cargar vía API (recomendado si ya tienes el backend corriendo)**:
   ```bash
   curl -X POST "http://localhost:3000/api/medicamentos/bulk" \
     -H "Content-Type: application/json" \
     -d @data/medicamentos.json
   ```

3. **Para regenerar el dataset** (reutiliza los mismos scripts):
   ```bash
   npm run db:import-invima
   ```

## ⚠️ Limitaciones conocidas

- **Sin conexión a Neon**: El dataset está listo para cargar, pero requiere `DATABASE_URL` y acceso a Neon PostgreSQL para insertar directamente en la base de datos. El script `scripts/import-invima-to-db.mjs` está preparado para usar `@neondatabase/serverless` + `drizzle-orm`, pero necesita credenciales de conexión.
- **Idempotencia**: El endpoint de bulk es idempotente gracias a `ON CONFLICT DO UPDATE` en la columna `id`, lo que significa que reejecutar el mismo JSON no crea duplicados.

## ✅ Próximos pasos para el usuario

1. Configurar `DATABASE_URL` en `.env.local` (ejecutar `neon deploy` si aún no lo ha hecho).
2. Ejecutar `npm run db:import-invima` para regenerar el dataset.
3. Ejecutar una de las opciones de carga (COPY, API o script directo) para registrar los datos en la base de datos.
4. Verificar que los endpoints de FarmaCheck (`/api/medicamentos` y `/api/medicamentos/bulk`) funcionen correctamente.

## 📚 Documentación adicional

- `DIAGNOSTICO_TECNICO.md` — detalles técnicos de la arquitectura.
- `src/app/api/medicamentos/route.ts` — endpoint de búsqueda y creación individual.
- `src/app/api/medicamentos/bulk/route.ts` — endpoint de carga masiva.
- `src/lib/schemas.ts` — definición de la tabla `medicamentos`.