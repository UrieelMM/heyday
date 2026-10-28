import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  LayoutDashboard,
  QrCode,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { TEMPLATES_CATALOG } from '@/lib/templates/templates-catalog';

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-stone-950 text-stone-100">
      {/* Navegación Principal */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-stone-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                Atelier<span className="text-amber-400">Invitaciones</span>
              </span>
              <span className="ml-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-amber-300 uppercase">
                v1.0 Pro
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/boda-sofia-y-mateo?g=fam-lopez-8a2f"
              className="hidden items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-stone-200 transition hover:bg-white/10 sm:inline-flex"
            >
              <Eye className="h-4 w-4 text-amber-400" />
              Ver Demo Invitado VIP
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold tracking-wider text-stone-950 uppercase shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
            >
              <LayoutDashboard className="h-4 w-4" />
              Abrir Dashboard & Builder
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Principal */}
      <section className="relative overflow-hidden border-b border-white/10 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-300">
            <Wand2 className="h-3.5 w-3.5" />
            <span>
              Motor Scrollytelling GSAP + Lenis • Links Personalizados por Familia • Pase QR Criptográfico
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Invitaciones Digitales Interactivas con{' '}
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Diseño de Autor
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-stone-400 sm:text-lg">
            Administra tus eventos, personaliza cualquiera de los 10 templates
            iniciales en tiempo real, genera URLs únicas por familia para
            bloquear cupos de RSVP y valida el acceso en puerta con códigos QR.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-7 py-4 text-sm font-bold tracking-wider text-stone-950 uppercase shadow-xl shadow-amber-500/20 transition hover:bg-amber-400"
            >
              Entrar al Dashboard y Constructor
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/boda-sofia-y-mateo?g=fam-lopez-8a2f"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <QrCode className="h-4 w-4 text-amber-400" />
              Probar URL Personalizada (/boda-sofia-y-mateo)
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
            {[
              '10 Templates Premium (Bodas, XV, Cumpleaños, Bautizo)',
              'Sobre Interactivo con Sello de Lacre + Música',
              'Botones CTA: Google Maps, Waze, Calendario y CLABE',
              'Pase VIP QR Criptográfico + DJ Playlist + Audio Guestbook',
            ].map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-xs text-stone-300"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo de los 10 Templates Iniciales */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-amber-400 uppercase">
              Catálogo Inicial Incluido
            </p>
            <h2 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
              10 Templates Interactivos Listos para Personalizar
            </h2>
          </div>
          <p className="max-w-md text-sm text-stone-400">
            Haz clic en cualquier plantilla para abrir su experiencia completa
            con sobre interactivo, animaciones de scroll y confirmación RSVP.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES_CATALOG.map((tpl, index) => (
            <div
              key={tpl.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-stone-900/70 transition hover:border-amber-500/40"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={tpl.previewImage}
                  alt={tpl.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                <span className="absolute top-3 left-3 rounded-full bg-stone-950/80 px-3 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
                  #{index + 1} • {tpl.categoryLabel}
                </span>
                <span className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                  {tpl.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">
                      {tpl.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      {[
                        tpl.colors.bgPrimary,
                        tpl.colors.accentPrimary,
                        tpl.colors.accentSecondary,
                      ].map((hex, i) => (
                        <span
                          key={i}
                          className="h-4 w-4 rounded-full border border-white/20"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-stone-400">
                    {tpl.description}
                  </p>
                  <p className="mt-3 text-[11px] font-medium text-amber-400/90">
                    ✦ {tpl.signatureAnimation}
                  </p>
                </div>

                <div className="mt-6 flex gap-2.5 pt-2">
                  <Link
                    href={`/demo-${tpl.id}?template=${tpl.id}&g=fam-invitada`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Probar Invitación
                  </Link>
                  <Link
                    href={`/dashboard?template=${tpl.id}`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-stone-950 transition hover:bg-amber-400"
                  >
                    Personalizar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
