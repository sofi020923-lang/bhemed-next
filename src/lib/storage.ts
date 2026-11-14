/**
 * Cliente de Neon Object Storage (S3-compatible).
 *
 * Las credenciales se leen de variables de entorno que el usuario debe definir en .env.local:
 *   AWS_ENDPOINT_URL_S3  -> endpoint del bucket (obtenido en la consola de Neon, tab Object storage)
 *   AWS_ACCESS_KEY_ID    -> token_id de la credencial de almacenamiento (nak_live_...)
 *   AWS_SECRET_ACCESS_KEY-> s3_secret_access_key (nsk_live_...)
 *   AWS_REGION           -> región del bucket (ej: us-east-2)
 *   NEON_STORAGE_BUCKET  -> nombre del bucket (ej: bhemed-medicamentos)
 *
 * El bucket debe crearse primero en la consola de Neon o con `neon buckets create`.
 * Para que las fotos sean visibles sin credenciales, crear el bucket con acceso `public_read`.
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const NEON_STORAGE_BUCKET = process.env.NEON_STORAGE_BUCKET || 'bhemed-medicamentos';

export const storageClient = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
});

export interface StorageUploadResult {
  key: string;
  url: string;
}

/**
 * Sube un archivo al bucket de Neon Object Storage.
 */
export async function uploadFile({
  key,
  body,
  contentType,
}: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
}): Promise<StorageUploadResult> {
  await storageClient.send(
    new PutObjectCommand({
      Bucket: NEON_STORAGE_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return { key, url: getPublicUrl(key) };
}

/**
 * URL pública del objeto (funciona si el bucket es public_read).
 */
export function getPublicUrl(key: string): string {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3 || '';
  return `${endpoint.replace(/\/$/, '')}/${NEON_STORAGE_BUCKET}/${encodeURIComponent(key)}`;
}

/**
 * Elimina un objeto del bucket.
 */
export async function deleteFile(key: string): Promise<void> {
  await storageClient.send(new DeleteObjectCommand({ Bucket: NEON_STORAGE_BUCKET, Key: key }));
}

/**
 * Genera una URL firmada temporal (útil si el bucket es privado).
 */
export async function getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(
    storageClient,
    new GetObjectCommand({ Bucket: NEON_STORAGE_BUCKET, Key: key }),
    { expiresIn }
  );
}
