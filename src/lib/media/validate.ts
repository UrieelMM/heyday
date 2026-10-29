export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

export async function validatePhoto(file: File): Promise<string> {
  if (!file.size || file.size > MAX_PHOTO_BYTES) throw new Error('Cada foto debe pesar entre 1 byte y 8 MB');
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const jpeg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const png = [137,80,78,71,13,10,26,10].every((n,i) => b[i] === n);
  const webp = String.fromCharCode(...b.slice(0,4)) === 'RIFF' && String.fromCharCode(...b.slice(8,12)) === 'WEBP';
  if (jpeg && file.type === 'image/jpeg') return 'jpg';
  if (png && file.type === 'image/png') return 'png';
  if (webp && file.type === 'image/webp') return 'webp';
  throw new Error('Usa una foto JPG, PNG o WebP válida');
}
