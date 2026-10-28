import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const RESERVED_SLUGS = new Set([
  'dashboard',
  'api',
  'login',
  'register',
  'auth',
  'admin',
  'demos',
  'pricing',
  'terms',
  'privacy',
  'settings',
  'checkin',
  'static',
  'assets',
  '_next',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
]);
