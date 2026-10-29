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

export async function validateEventMedia(file: File): Promise<string> {
  if (file.type.startsWith('image/')) return validatePhoto(file);
  if (!file.size || file.size > 30 * 1024 * 1024) throw new Error('El audio o video puede pesar hasta 30 MB');
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (file.type === 'audio/mpeg' && (ascii(0, 3) === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0))) return 'mp3';
  if (file.type === 'audio/mp4' && ascii(4, 8) === 'ftyp') return 'm4a';
  if (file.type === 'video/mp4' && ascii(4, 8) === 'ftyp') return 'mp4';
  if (file.type === 'video/webm' && bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) return 'webm';
  throw new Error('Usa un archivo JPG, PNG, WebP, MP3, M4A, MP4 o WebM válido');
}
