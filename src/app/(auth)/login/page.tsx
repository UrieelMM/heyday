'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { HeyDayBrand } from '@/components/brand/HeyDayBrand';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email(),
  password: z.string().min(1).max(128),
});

function getLoginError(code?: string) {
  if (code === 'email_not_confirmed') return 'Confirma tu correo antes de entrar.';
  if (code === 'over_request_rate_limit' || code === 'over_email_send_rate_limit') {
    return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
  }
  return 'Correo o contraseña incorrectos.';
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template');
  const validTemplate = templateParam && /^[a-z0-9-]{1,60}$/.test(templateParam);
  const targetUrl = validTemplate
    ? `/dashboard?template=${encodeURIComponent(templateParam)}`
    : '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get('reason') === 'unauthorized') {
      toast.error('Esta cuenta no tiene acceso al dashboard.');
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.path[0] === 'email'
        ? 'Escribe un correo electrónico válido.'
        : 'Escribe tu contraseña.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
      if (error || !data.user) {
        toast.error(getLoginError(error?.code));
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();
      if (profileError || !['agency_admin', 'superadmin'].includes(profile?.role ?? '')) {
        await supabase.auth.signOut();
        toast.error('Esta cuenta no tiene acceso al dashboard.');
        return;
      }

      toast.success('Bienvenido al panel de administración');
      router.replace(targetUrl);
      router.refresh();
    } catch {
      toast.error('No pudimos iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-shell min-h-dvh bg-[#faf9f5] text-[#141413]">
      <header className="border-b border-[#e6dfd8]">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#3d3d3a] transition-colors hover:text-[#141413]">
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio
          </Link>
          <HeyDayBrand />
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100dvh-64px)] max-w-[1200px] lg:grid-cols-2">
        <section className="hidden border-r border-[#e6dfd8] px-8 py-20 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="eyebrow text-[#cc785c]">Panel de administración</p>
            <h1 className="editorial-display mt-5 max-w-lg font-[var(--font-cormorant)] text-6xl leading-[1.05]">
              Todo tu evento, en un espacio que sí se siente claro.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[#3d3d3a]">
              Continúa donde lo dejaste: clientes, diseño, invitados y recepción comparten el mismo flujo.
            </p>
          </div>

          <div className="max-w-md rounded-xl bg-[#141413] p-6 text-[#faf9f5]">
            <p className="eyebrow text-[#e8a55a]">Dentro del panel</p>
            <div className="mt-5 space-y-4">
              {[
                'Historial por cliente y template',
                'Constructor visual en tiempo real',
                'Links nominales y RSVP controlado',
                'Pases QR para recepción',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-white/15 pb-4 text-sm last:border-0 last:pb-0">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5db872] text-[#141413]">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-12 sm:px-8 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#e6dfd8] bg-white text-[#cc785c]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h2 className="editorial-display mt-5 font-[var(--font-cormorant)] text-5xl">Bienvenido de vuelta.</h2>
              <p className="mt-2 text-sm leading-6 text-[#3d3d3a]">
                Ingresa para gestionar tus invitaciones y clientes.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-xs font-medium text-[#3d3d3a]">Correo electrónico</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#8e8b82]" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={254}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full rounded-lg border py-3 pr-4 pl-10 text-sm outline-none transition-colors focus:border-[#cc785c]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-2 block text-xs font-medium text-[#3d3d3a]">Contraseña</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#8e8b82]" />
                  <input
                    id="admin-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    maxLength={128}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border py-3 pr-4 pl-10 text-sm outline-none transition-colors focus:border-[#cc785c]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#cc785c] px-5 text-sm font-medium text-white transition-colors hover:bg-[#a9583e] disabled:opacity-50"
              >
                {isSubmitting ? 'Abriendo tu espacio…' : 'Entrar al dashboard'}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="mono-label mt-6 text-center text-[10px] text-[#8e8b82]">
              ACCESO PRIVADO · HEYDAY
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[#faf9f5] text-sm text-[#6c6a64]">
          Preparando acceso…
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
