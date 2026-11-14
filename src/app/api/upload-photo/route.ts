import { NextResponse } from 'next/server';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { storageClient, NEON_STORAGE_BUCKET, getPublicUrl } from '@/lib/storage';

// Evitar prerenderizado en build (la ruta usa el runtime de Node y credenciales)
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * POST /api/upload-photo
 *
 * Recibe un FormData con:
 *   - file: archivo de imagen (JPEG, PNG, WebP)
 *   - medicamentoId (opcional): para asociar la foto a un medicamento personal
 *
 * Sube la imagen a Neon Object Storage (bucket S3-compatible) y devuelve:
 *   { success: true, url: string, key: string }
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Solo se permiten imágenes (JPEG, PNG, WebP)' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'La imagen no debe superar los 5 MB' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop() || 'jpg';
    const key = `medicamentos/${crypto.randomUUID()}.${ext}`;

    await storageClient.send(
      new PutObjectCommand({
        Bucket: NEON_STORAGE_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const url = getPublicUrl(key);

    // Si se proporciona medicamentoId, se podría actualizar foto_url en la BD aquí.
    // Por ahora el frontend recibe la URL y la almacena en su estado.

    return NextResponse.json({ success: true, url, key });
  } catch (error) {
    console.error('Error subiendo foto a Neon Storage:', error);
    return NextResponse.json({ success: false, error: 'Error interno al subir la fotografía' }, { status: 500 });
  }
}

/**
 * DELETE /api/upload-photo?key=<key>
 *
 * Elimina un archivo del bucket de Neon Object Storage.
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ success: false, error: 'Parámetro "key" requerido' }, { status: 400 });
    }

    await storageClient.send(new DeleteObjectCommand({ Bucket: NEON_STORAGE_BUCKET, Key: key }));

    return NextResponse.json({ success: true, message: 'Fotografía eliminada' });
  } catch (error) {
    console.error('Error eliminando foto de Neon Storage:', error);
    return NextResponse.json({ success: false, error: 'Error interno al eliminar la fotografía' }, { status: 500 });
  }
}