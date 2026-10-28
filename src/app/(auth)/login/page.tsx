'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
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
    getAdminSession();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const result = loginFakeAdmin(email, password);
      if (!result.success) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      toast.success('Bienvenido al panel de administración');
      router.push(targetUrl);
    }, 350);
  };

  const handleQuickFill = () => {
    setEmail(DEMO_ADMIN_USER.email);
    setPassword(DEMO_ADMIN_USER.password);
    toast.info('Acceso demo preparado');
  };

  return (
    <main className="login-shell min-h-dvh bg-[#f7f7f4] text-[#26251e]">
      <header className="border-b border-[#e6e5e0]">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#5a5852] transition-colors hover:text-[#26251e]">
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio
          </Link>
          <div className="inline-flex items-center gap-2.5">
            <span className="grid h-8 w-8 grid-cols-2 gap-0.5 rounded-md bg-[#f54e00] p-1.5">
              <span className="rounded-[1px] bg-white/95" />
              <span className="rounded-[1px] bg-white/65" />
              <span className="rounded-[1px] bg-white/65" />
              <span className="rounded-[1px] bg-white/95" />
            </span>
            <span className="text-sm font-medium tracking-[-0.02em] text-[#f54e00]">Atelier Invitaciones</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100dvh-64px)] max-w-[1200px] lg:grid-cols-2">
        <section className="hidden border-r border-[#e6e5e0] px-8 py-20 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="eyebrow text-[#f54e00]">Panel de administración</p>
            <h1 className="editorial-display mt-5 max-w-lg text-6xl leading-[1.05]">
              Todo tu evento, en un espacio que sí se siente claro.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[#5a5852]">
              Continúa donde lo dejaste: clientes, diseño, invitados y recepción comparten el mismo flujo.
            </p>
          </div>

          <div className="max-w-md rounded-xl bg-[#26251e] p-6 text-[#f7f7f4]">
            <p className="eyebrow text-[#dfa88f]">Dentro del panel</p>
            <div className="mt-5 space-y-4">
              {[
                'Historial por cliente y template',
                'Constructor visual en tiempo real',
                'Links nominales y RSVP controlado',
                'Pases QR para recepción',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-white/15 pb-4 text-sm last:border-0 last:pb-0">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9fc9a2] text-[#26251e]">
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
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#e6e5e0] bg-white text-[#f54e00]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h2 className="editorial-display mt-5 text-4xl">Bienvenido de vuelta.</h2>
              <p className="mt-2 text-sm leading-6 text-[#5a5852]">
                Ingresa para gestionar tus invitaciones y clientes.
              </p>
            </div>

            <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-[#e6e5e0] bg-[#fafaf7] p-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#dfa88f]/55 text-[#26251e]">
                  <KeyRound className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-medium">Modo demo local</p>
                  <p className="mt-0.5 text-[11px] text-[#807d72]">Acceso preparado para explorar el producto</p>
                </div>
              </div>
              <button type="button" onClick={handleQuickFill} className="shrink-0 rounded-md border border-[#cfcdc4] bg-white px-3 py-2 text-xs font-medium transition-colors hover:bg-[#efeee8]">
                Rellenar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-xs font-medium text-[#5a5852]">Correo electrónico</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#a09c92]" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@atelierinvitaciones.com"
                    className="w-full rounded-lg border py-3 pr-4 pl-10 text-sm outline-none transition-colors focus:border-[#f54e00]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-2 block text-xs font-medium text-[#5a5852]">Contraseña</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#a09c92]" />
                  <input
                    id="admin-password"
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border py-3 pr-4 pl-10 text-sm outline-none transition-colors focus:border-[#f54e00]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#f54e00] px-5 text-sm font-medium text-white transition-colors hover:bg-[#d04200] disabled:opacity-50"
              >
                {isSubmitting ? 'Abriendo tu espacio…' : 'Entrar al dashboard'}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="mono-label mt-6 text-center text-[10px] text-[#a09c92]">
              DEMO LOCAL · LISTO PARA SUPABASE AUTH
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
        <div className="flex min-h-dvh items-center justify-center bg-[#f7f7f4] text-sm text-[#807d72]">
          Preparando acceso…
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
