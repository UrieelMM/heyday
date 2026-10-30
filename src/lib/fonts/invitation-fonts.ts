export const INVITATION_FONTS = [
  { name: 'Cormorant Garamond', family: 'var(--font-cormorant), Georgia, serif' },
  { name: 'Playfair Display', family: 'var(--font-playfair), Georgia, serif' },
  { name: 'Cinzel', family: 'var(--font-cinzel), Georgia, serif' },
  { name: 'Syne', family: 'var(--font-syne), Arial, sans-serif' },
  { name: 'Fredoka', family: 'var(--font-fredoka), Arial, sans-serif' },
  { name: 'Pinyon Script', family: 'var(--font-pinyon), cursive' },
  { name: 'Great Vibes', family: 'var(--font-great-vibes), cursive' },
  { name: 'Plus Jakarta Sans', family: 'var(--font-jakarta), Arial, sans-serif' },
  { name: 'Montserrat', family: 'var(--font-montserrat), Arial, sans-serif' },
  { name: 'Inter', family: 'var(--font-inter), Arial, sans-serif' },
  { name: 'JetBrains Mono', family: 'var(--font-jetbrains), monospace' },
  { name: 'Space Grotesk', family: 'var(--font-space), Arial, sans-serif' },
  { name: 'Georgia', family: 'Georgia, serif' },
  { name: 'Arial', family: 'Arial, sans-serif' },
  { name: 'Verdana', family: 'Verdana, sans-serif' },
  { name: 'Trebuchet MS', family: '"Trebuchet MS", Arial, sans-serif' },
  { name: 'Times New Roman', family: '"Times New Roman", serif' },
  { name: 'Courier New', family: '"Courier New", monospace' },
  { name: 'Tahoma', family: 'Tahoma, Arial, sans-serif' },
  { name: 'Palatino', family: 'Palatino, "Palatino Linotype", Georgia, serif' },
] as const;

export function invitationFontStack(name: string): string {
  return INVITATION_FONTS.find(font => font.name === name)?.family ?? `"${name.replaceAll('"', '')}", Georgia, serif`;
}
