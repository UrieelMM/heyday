export const DEMO_ADMIN_USER = {
  email: 'admin@atelierinvitaciones.com',
  password: 'Admin2026!',
  name: 'Administrador Principal',
  role: 'agency_admin',
};

const AUTH_STORAGE_KEY = 'atelier_admin_session_v1';

export interface AdminSession {
  email: string;
  name: string;
  role: string;
  loggedInAt: string;
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function loginFakeAdmin(
  email: string,
  password: string
): { success: boolean; error?: string; session?: AdminSession } {
  if (
    email.trim().toLowerCase() === DEMO_ADMIN_USER.email.toLowerCase() &&
    password === DEMO_ADMIN_USER.password
  ) {
    const session: AdminSession = {
      email: DEMO_ADMIN_USER.email,
      name: DEMO_ADMIN_USER.name,
      role: DEMO_ADMIN_USER.role,
      loggedInAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      document.cookie = `atelier_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax`;
    }
    return { success: true, session };
  }

  return {
    success: false,
    error:
      'Credenciales inválidas. Usa admin@atelierinvitaciones.com / Admin2026!',
  };
}

export function logoutFakeAdmin(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie =
      'atelier_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}
