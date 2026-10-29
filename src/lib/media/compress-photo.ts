import 'server-only';
import sharp from 'sharp';

const MAX_IMAGE_PIXELS = 40_000_000;

export interface CompressedPhoto {
  image: Buffer;
  thumbnail: Buffer;
  contentType: 'image/webp';
  extension: 'webp';
}

/**
 * Normalizes camera orientation, removes metadata and creates a high-quality
 * WebP plus a small thumbnail. The 2560px cap keeps album photos crisp on
 * high-density screens without retaining unnecessarily large camera files.
 */
export async function compressPhoto(file: File): Promise<CompressedPhoto> {
  const source = Buffer.from(await file.arrayBuffer());
  const pipeline = sharp(source, {
    failOn: 'error',
    limitInputPixels: MAX_IMAGE_PIXELS,
  }).rotate();

  const [image, thumbnail] = await Promise.all([
    pipeline
      .clone()
      .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 88, alphaQuality: 90, effort: 5, smartSubsample: true })
      .toBuffer(),
    pipeline
      .clone()
      .resize({ width: 480, height: 480, fit: 'cover', position: 'attention', withoutEnlargement: true })
      .webp({ quality: 78, alphaQuality: 82, effort: 4, smartSubsample: true })
      .toBuffer(),
  ]);

  return { image, thumbnail, contentType: 'image/webp', extension: 'webp' };
}
