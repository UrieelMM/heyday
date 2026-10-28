'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  DEMO_ADMIN_USER,
  getAdminSession,
  loginFakeAdmin,
} from '@/lib/auth/fake-auth';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template');
  const targetUrl = templateParam
    ? `/dashboard?template=${templateParam}`
    : '/dashboard';

  const [email, setEmail] = useState(DEMO_ADMIN_USER.email);
  const [password, setPassword] = useState(DEMO_ADMIN_USER.password);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const existing = getAdminSession();
    if (existing) {
      // Ya tiene sesión activa, puede continuar directo si lo desea
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const result = loginFakeAdmin(email, password);
      if (!result.success) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      toast.success('¡Bienvenido al Panel de Administración!');
      router.push(targetUrl);
    }, 350);
  };

  const handleQuickFill = () => {
    setEmail(DEMO_ADMIN_USER.email);
    setPassword(DEMO_ADMIN_USER.password);
    toast.info('Credenciales de Administrador cargadas');
  };

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-stone-950 px-6 py-10 text-stone-100">
      {/* Resplandor ambiental */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[680px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Top link */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-stone-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la Landing Principal
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-stone-950">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            Atelier<span className="text-amber-400">Invitaciones</span>
          </span>
        </div>
      </div>

      {/* Tarjeta Central de Login */}
      <div className="relative z-10 mx-auto my-12 w-full max-w-md">
        <div className="rounded-3xl border border-white/15 bg-stone-900/85 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Acceso Administrador
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-stone-400">
              Inicia sesión para gestionar las invitaciones de tus clientes,
              personalizar templates y administrar el historial por plantilla.
            </p>
          </div>

          {/* Banner de Credenciales Fake / Pre-Supabase */}
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-bold text-amber-300 uppercase">
                <KeyRound className="h-3.5 w-3.5" />
                Modo Demo Local (Pre-Supabase)
              </span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="cursor-pointer rounded-lg bg-amber-500/20 px-2.5 py-1 text-[11px] font-semibold text-amber-200 transition hover:bg-amber-500/30"
              >
                Rellenar datos
              </button>
            </div>
            <div className="mt-2.5 space-y-1 font-mono text-[11px] text-stone-300">
              <p>
                <span className="text-stone-400">Usuario:</span>{' '}
                {DEMO_ADMIN_USER.email}
              </p>
              <p>
                <span className="text-stone-400">Password:</span>{' '}
                {DEMO_ADMIN_USER.password}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-xs font-semibold tracking-wider text-stone-300 uppercase"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-3.5 left-3.5 h-4 w-4 text-stone-500" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@atelierinvitaciones.com"
                  className="w-full rounded-xl border border-white/15 bg-stone-950 py-3 pr-4 pl-10 text-sm text-white outline-none transition focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-semibold tracking-wider text-stone-300 uppercase"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-3.5 left-3.5 h-4 w-4 text-stone-500" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/15 bg-stone-950 py-3 pr-4 pl-10 text-sm text-white outline-none transition focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-xs font-bold tracking-wider text-stone-950 uppercase shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? 'Iniciando sesión...'
                  : 'Entrar al Dashboard & Builder'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer simple */}
      <p className="relative z-10 text-center text-xs text-stone-500">
        Atelier Invitaciones Digitales • Autenticación lista para conectar con
        Supabase Auth
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-stone-950 text-stone-400">
          Cargando acceso...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
