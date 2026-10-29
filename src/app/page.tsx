'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  QrCode,
  ShieldCheck,
  Smartphone,
  Users,
  WandSparkles,
} from 'lucide-react';
import { HeyDayBrand } from '@/components/brand/HeyDayBrand';
import { TEMPLATES_CATALOG } from '@/lib/templates/templates-catalog';
import type { EventCategory } from '@/types/invitation.types';
// @ts-expect-error Next.js handles global CSS imports at build time.
import './landing.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const whatsappHref = (message: string) =>
  `https://wa.me/525628051962?text=${encodeURIComponent(message)}`;
const CONTACT_URL = whatsappHref('¡Hola, HeyDay! Me gustaría crear una invitación digital para mi evento.');

const CATEGORY_FILTERS: Array<{ id: 'all' | EventCategory; label: string }> = [
  { id: 'all', label: 'Todas' },
  { id: 'wedding', label: 'Bodas' },
  { id: 'xv_years', label: 'XV años' },
  { id: 'adult_birthday', label: 'Cumpleaños' },
  { id: 'kids_birthday', label: 'Infantiles' },
  { id: 'baptism_communion', label: 'Bautizo' },
  { id: 'baby_shower', label: 'Baby shower' },
  { id: 'graduation_gala', label: 'Graduación' },
];

const FEATURES = [
  {
    number: '01', icon: Users,
    title: 'Invita a todos, sin límite.',
    description: 'Comparte tu celebración con tantas personas como quieras. Cada familia puede recibir su propio enlace y sus pases asignados.',
  },
  {
    number: '02', icon: Heart,
    title: 'Una historia que se siente tuya.',
    description: 'Fotografías, música, cuenta regresiva y detalles de tu evento se convierten en una experiencia que se descubre al recorrerla.',
  },
  {
    number: '03', icon: Smartphone,
    title: 'Lista para abrir desde WhatsApp.',
    description: 'Tus invitados entran desde su teléfono, sin instalar nada. Todo está pensado para disfrutarse en móvil.',
  },
  {
    number: '04', icon: QrCode,
    title: 'Confirmaciones sin complicaciones.',
    description: 'Recibe respuestas RSVP y comparte pases digitales con QR para que la llegada a tu evento sea más sencilla.',
  },
  {
    number: '05', icon: MapPin,
    title: 'Cada detalle, a un toque.',
    description: 'Ubicaciones, rutas, itinerario, código de vestimenta y mesa de regalos reunidos en un mismo lugar.',
  },
  {
    number: '06', icon: Camera,
    title: 'Un álbum para recordar juntos.',
    description: 'Invita a tus seres queridos a compartir las fotos que capturen durante la celebración.',
    note: '*Álbum compartido: hasta 50 fotos por evento.',
  },
];

const FAQS = [
  {
    question: '¿Hay límite de invitados?',
    answer: 'No. Puedes compartir tu invitación con tantos invitados como necesites, sin costo adicional por persona.',
  },
  {
    question: '¿Puedo ver una invitación antes de elegir?',
    answer: 'Sí. Las demos de la colección están abiertas para que recorras los diseños desde tu teléfono o computadora.',
  },
  {
    question: '¿Cómo recibo las confirmaciones?',
    answer: 'Tus invitados responden desde la invitación. Cuando confirman, pueden consultar su pase digital con QR y los datos de su evento.',
  },
  {
    question: '¿Cuál es la diferencia entre los dos planes?',
    answer: 'El diseño de colección parte de uno de nuestros estilos disponibles. El diseño personalizado crea una dirección visual propia para tu celebración.',
  },
];

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <span className="heyday-whatsapp-icon" aria-hidden="true" style={{ width: size, height: size }}>
      <MessageCircle size={size} strokeWidth={2.1} />
      <Phone size={size * 0.48} strokeWidth={2.5} />
    </span>
  );
}

function InvitationPreview() {
  return (
    <div className="landing-invitation-preview" aria-label="Ejemplo visual de una invitación digital">
      <div className="landing-invitation-preview__card">
        <img src="/images/boho-terracotta/sunset-garden.jpg" alt="Mesa de celebración al atardecer" loading="lazy" />
        <div className="landing-invitation-preview__wash" aria-hidden="true" />
        <div className="landing-invitation-preview__content">
          <span>Nos casamos</span>
          <strong>Sofía <em>&</em> Mateo</strong>
          <span>14 · NOVIEMBRE · 2026</span>
          <span>San Miguel de Allende</span>
        </div>
        <div className="landing-invitation-preview__bottom">HEYDAY.PARTY / UNA HISTORIA POR CELEBRAR</div>
      </div>
      <div className="landing-invitation-preview__rsvp">
        <span className="landing-invitation-preview__seal"><Heart size={18} strokeWidth={1.6} /></span>
        <span><small>INVITACIÓN PARA</small><strong>Familia López García</strong><small>4 pases reservados para ustedes</small></span>
      </div>
      <div className="landing-invitation-preview__ticket"><QrCode size={23} /><span><strong>Confirmación lista</strong><small>Tu lugar te espera</small></span><Check size={17} /></div>
    </div>
  );
}

export default function HomePage() {
  const landingRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | EventCategory>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useGSAP(() => {
    const root = landingRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const hero = root.querySelector('.landing-hero');
    const visual = root.querySelector('.landing-hero__visual');
    const intro = root.querySelector('.landing-hero__intro');
    const finale = root.querySelector('.landing-hero__finale');
    if (hero && visual && intro && finale) {
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
      })
        .to(intro, { yPercent: -16, autoAlpha: 0, duration: 0.42 }, 0)
        .to(visual, { top: '0%', left: '0%', width: '100%', height: '100%', borderRadius: 0, duration: 0.85 }, 0)
        .to('.landing-hero__image', { scale: 1.08, duration: 1 }, 0)
        .to('.landing-hero__visual-shade', { opacity: 1, duration: 0.85 }, 0)
        .fromTo(finale, { yPercent: 16, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.3 }, 0.68);
    }

    root.querySelectorAll<HTMLElement>('[data-landing-scene]').forEach((scene) => {
      const moving = scene.querySelector<HTMLElement>('[data-scene-depth]');
      if (moving) {
        gsap.fromTo(moving, { yPercent: 7 }, {
          yPercent: -7, ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }
      const reveals = scene.querySelectorAll<HTMLElement>('[data-scene-reveal]');
      if (reveals.length) {
        gsap.fromTo(reveals, { y: 48, opacity: 0.55 }, {
          y: 0, opacity: 1, ease: 'none', stagger: 0.12,
          scrollTrigger: { trigger: scene, start: 'top 85%', end: 'top 25%', scrub: 0.7 },
        });
      }
    });
  }, { scope: landingRef });

  const filteredTemplates = selectedCategory === 'all'
    ? TEMPLATES_CATALOG
    : TEMPLATES_CATALOG.filter((template) => template.category === selectedCategory);

  return (
    <div ref={landingRef} className="landing min-h-dvh bg-[#faf9f5] text-[#141413]">
      <header className="sticky top-0 z-40 border-b border-[#e6dfd8] bg-[#faf9f5]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="shrink-0" aria-label="HeyDay, volver al inicio"><HeyDayBrand /></Link>
          <nav className="hidden items-center gap-6 text-sm text-[#3d3d3a] lg:flex" aria-label="Navegación principal">
            <a href="#producto">La experiencia</a>
            <a href="#templates">Diseños</a>
            <a href="#precios">Precios</a>
            <a href="#faq">Preguntas</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#templates" className="landing-header-demo hidden h-10 items-center rounded-lg border border-[#d7cfc4] bg-white px-4 text-sm text-[#141413] sm:inline-flex">Ver demos</a>
            <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className="landing-header-contact inline-flex h-10 items-center gap-2 rounded-lg bg-[#cc785c] px-4 text-sm font-medium text-white hover:bg-[#a9583e]">
              <WhatsAppIcon size={17} /><span className="landing-header-contact__wide">Contactar por WhatsApp</span><span className="landing-header-contact__short">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-hero" aria-label="Presentación de HeyDay">
          <div className="landing-hero__stage">
            <div className="landing-hero__grain" aria-hidden="true" />
            <div className="landing-hero__intro">
              <p className="landing-kicker"><span className="landing-kicker__line" /> Invitaciones digitales con alma</p>
              <h1>El inicio de una historia <em>inolvidable.</em></h1>
              <p className="landing-hero__lead">Haz que tus invitados vivan la emoción desde el primer momento: una invitación interactiva, personal y lista para compartir.</p>
              <div className="landing-hero__actions">
                <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className="landing-button landing-button--primary"><WhatsAppIcon size={17} /> Cotizar por WhatsApp</a>
                <a href="#templates" className="landing-button landing-button--outline"><Eye size={17} /> Ver demos públicos</a>
              </div>
              <span className="landing-hero__index">01 / Tu celebración empieza aquí</span>
            </div>
            <div className="landing-hero__visual" aria-hidden="true">
              <img className="landing-hero__image" src="/images/boho-terracotta/sunset-garden.jpg" alt="" fetchPriority="high" />
              <span className="landing-hero__visual-shade" />
              <span className="landing-hero__visual-caption">HEYDAY.PARTY / HAZ DE CADA DÍA UNA HISTORIA</span>
              <span className="landing-hero__visual-frame" />
            </div>
            <div className="landing-hero__finale">
              <p className="landing-kicker">Para momentos que merecen más</p>
              <p className="landing-hero__finale-title">Una invitación tan especial como tu historia.</p>
              <a href="#producto" className="landing-button landing-button--light">Descubre la experiencia <ArrowRight size={17} /></a>
            </div>
            <div className="landing-hero__scroll" aria-hidden="true"><span /> Desliza para descubrir</div>
          </div>
        </section>

        <section id="producto" className="landing-product" data-landing-scene>
          <div className="landing-product__orb" aria-hidden="true" />
          <div className="landing-container landing-product__grid">
            <div className="landing-product__copy" data-scene-reveal>
              <p className="landing-kicker">Mucho más que una invitación</p>
              <h2>Que la emoción empiece <em>antes de llegar.</em></h2>
              <p>Tu celebración se presenta como una experiencia: una portada que sorprende, tu historia, cada detalle importante y una forma sencilla de confirmar.</p>
              <div className="landing-product__metrics">
                <div><strong>∞</strong><span>invitados, sin límite</span></div>
                <div><strong>10</strong><span>estilos para descubrir</span></div>
                <div><strong>01</strong><span>historia: la tuya</span></div>
              </div>
            </div>
            <div className="landing-product__preview" data-scene-depth>
              <div className="landing-product__preview-label"><span /> Así se vive HeyDay</div>
              <InvitationPreview />
            </div>
          </div>
        </section>

        <section className="landing-features landing-container" data-landing-scene>
          <div className="landing-section-heading" data-scene-reveal>
            <p className="landing-kicker">Cada detalle cuenta</p>
            <h2>Diseñado para sorprender.<br /><em>Creado para acompañarte.</em></h2>
            <p>Desde el primer enlace hasta el último recuerdo, todo lo que tus invitados necesitan cabe en una experiencia especial.</p>
          </div>
          <div className="landing-features__grid">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.number} className="landing-feature" data-scene-reveal>
                  <div className="landing-feature__top"><Icon size={23} strokeWidth={1.5} /><span>{feature.number} / 06</span></div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  {'note' in feature && <small className="landing-feature__note">{feature.note}</small>}
                  <span className="landing-feature__rule" />
                </article>
              );
            })}
          </div>
        </section>

        <section id="flujo" className="landing-flow" data-landing-scene>
          <div className="landing-container landing-flow__inner">
            <div className="max-w-2xl" data-scene-reveal>
              <p className="eyebrow text-[#cc785c]">Así comienza tu HeyDay</p>
              <h2 className="editorial-display mt-4">De tu idea al gran día, sin complicaciones.</h2>
            </div>
            <div className="landing-flow__steps mt-9 overflow-hidden rounded-xl border border-[#e6dfd8] bg-white">
              {[
                { icon: MessageCircle, phase: 'Cuéntanos', title: 'Escríbenos por WhatsApp y comparte la fecha y el estilo de tu celebración.', color: '#e8a55a' },
                { icon: WandSparkles, phase: 'Elige', title: 'Escoge un diseño de colección o pide una propuesta visual personalizada.', color: '#5db8a6' },
                { icon: Smartphone, phase: 'Comparte', title: 'Envía tu invitación por WhatsApp a todos tus invitados, sin límite de personas.', color: '#5db872' },
                { icon: Heart, phase: 'Celebra', title: 'Recibe confirmaciones y disfruta cada momento con quienes más quieres.', color: '#e8a55a' },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.phase} className="landing-flow__step grid gap-4 border-b border-[#e6dfd8] p-5 last:border-b-0 sm:grid-cols-[80px_140px_1fr_auto] sm:items-center sm:px-7" data-scene-reveal>
                    <span className="mono-label text-xs text-[#8e8b82]">0{index + 1}</span>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#141413]" style={{ backgroundColor: step.color }}><Icon className="h-3.5 w-3.5" />{step.phase}</span>
                    <p className="text-base text-[#3d3d3a]">{step.title}</p>
                    <ArrowRight className="hidden h-4 w-4 text-[#8e8b82] sm:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="templates" className="landing-templates landing-container" data-landing-scene>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end" data-scene-reveal>
            <div className="max-w-2xl">
              <p className="eyebrow text-[#cc785c]">Explora la colección</p>
              <h2 className="editorial-display mt-4">Un estilo para cada forma de celebrar.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#3d3d3a]">Abre las demos públicas y recórrelas a tu ritmo. Tu invitación llevará tus nombres, fotos y detalles.</p>
          </div>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Filtrar diseños">
            {CATEGORY_FILTERS.map((category) => (
              <button key={category.id} type="button" role="tab" aria-selected={selectedCategory === category.id} onClick={() => setSelectedCategory(category.id)}
                className={`h-9 shrink-0 rounded-full px-4 text-xs font-medium transition-colors ${selectedCategory === category.id ? 'bg-[#141413] text-[#faf9f5]' : 'border border-[#d7cfc4] bg-white text-[#3d3d3a] hover:text-[#141413]'}`}>{category.label}</button>
            ))}
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template, index) => (
              <article key={template.id} className="landing-template group overflow-hidden rounded-xl border border-[#e6dfd8] bg-white" data-scene-reveal>
                <div className="relative aspect-[4/3] overflow-hidden bg-[#ebe6df]">
                  <img src={template.previewImage} alt={`Vista previa de ${template.name}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                    <span className="rounded-full bg-[#faf9f5]/90 px-2.5 py-1 text-[10px] font-medium text-[#141413] backdrop-blur-sm">{template.categoryLabel}</span>
                    <span className="mono-label rounded-full bg-[#141413]/85 px-2.5 py-1 text-[9px] text-white">0{index + 1}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div><h3 className="text-lg font-normal tracking-[-0.015em]">{template.name}</h3><p className="mt-1 text-xs leading-5 text-[#6c6a64]">{template.description}</p></div>
                    <div className="flex shrink-0 gap-1.5 pt-1">{[template.colors.bgPrimary, template.colors.accentPrimary, template.colors.accentSecondary].map((color) => <span key={color} className="h-3.5 w-3.5 rounded-full border border-[#e6dfd8]" style={{ backgroundColor: color }} />)}</div>
                  </div>
                  <div className="mt-5 flex gap-2 border-t border-[#ebe6df] pt-4">
                    <Link href={`/demo/${template.id}?g=fam-invitada`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#d7cfc4] text-xs font-medium transition-colors hover:bg-[#f5f0e8]"><Eye className="h-3.5 w-3.5" /> Ver demo</Link>
                    <a href={whatsappHref(`¡Hola, HeyDay! Me interesa el diseño ${template.name} para mi evento.`)} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#cc785c] text-xs font-medium text-white transition-colors hover:bg-[#a9583e]">Elegir este estilo</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="precios" className="landing-pricing" data-landing-scene>
          <div className="landing-container">
            <div className="landing-pricing__heading" data-scene-reveal>
              <p className="landing-kicker">Precios claros</p>
              <h2>Tu historia merece una gran entrada. <em>Desde $400.</em></h2>
              <p>Elige el estilo que mejor va contigo. En ambos planes puedes invitar a tantas personas como quieras.</p>
            </div>
            <div className="landing-pricing__grid">
              <article className="landing-price-card" data-scene-reveal>
                <span className="landing-price-card__label">DISEÑO DE COLECCIÓN</span>
                <h3>Hazlo tuyo.</h3>
                <p>Partimos de uno de nuestros diseños disponibles y lo llenamos con la historia y los detalles de tu evento.</p>
                <div className="landing-price-card__amount"><strong>$400</strong><span>MXN / invitación</span></div>
                <ul>
                  <li><Check size={16} /> Diseño de colección personalizado con tus datos</li>
                  <li><Check size={16} /> Invitados ilimitados</li>
                  <li><Check size={16} /> RSVP y pase digital con QR</li>
                  <li><Check size={16} /> Álbum compartido de fotos*</li>
                </ul>
                <small>*Hasta 50 fotos por evento.</small>
                <a href={whatsappHref('¡Hola, HeyDay! Me interesa la invitación con diseño de colección de $400 MXN.')} target="_blank" rel="noopener noreferrer" className="landing-button landing-button--outline"><WhatsAppIcon size={17} /> Pedir diseño de colección</a>
              </article>
              <article className="landing-price-card landing-price-card--featured" data-scene-reveal>
                <span className="landing-price-card__label">DISEÑO PERSONALIZADO</span>
                <h3>Solo para tu día.</h3>
                <p>Una dirección visual creada para tu celebración, con una estética que refleje lo que la hace única.</p>
                <div className="landing-price-card__amount"><strong>$500</strong><span>MXN / invitación</span></div>
                <ul>
                  <li><Check size={16} /> Diseño visual propio de tu evento</li>
                  <li><Check size={16} /> Invitados ilimitados</li>
                  <li><Check size={16} /> RSVP y pase digital con QR</li>
                  <li><Check size={16} /> Álbum compartido de fotos*</li>
                </ul>
                <small>*Hasta 50 fotos por evento.</small>
                <a href={whatsappHref('¡Hola, HeyDay! Me interesa la invitación con diseño personalizado de $500 MXN.')} target="_blank" rel="noopener noreferrer" className="landing-button landing-button--primary"><WhatsAppIcon size={17} /> Pedir diseño personalizado</a>
              </article>
            </div>
          </div>
        </section>

        <section className="landing-reception border-y border-[#e6dfd8] bg-white" data-landing-scene>
          <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div data-scene-reveal>
              <p className="eyebrow text-[#cc785c]">Todo en su lugar</p>
              <h2 className="editorial-display mt-4">Invita sin límites. Celebra sin perder ningún detalle.</h2>
              <div className="mt-7 space-y-3">
                {['Comparte el enlace fácilmente por WhatsApp', 'Conoce quiénes confirmaron su asistencia', 'Ubicación, horarios y regalos siempre a la mano', 'Pases digitales con QR para la recepción'].map((item) => (
                  <div key={item} className="flex items-center gap-3 border-b border-[#ebe6df] pb-3 text-sm text-[#3d3d3a]"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5db872]/55 text-[#141413]"><Check className="h-3 w-3" strokeWidth={2.5} /></span>{item}</div>
                ))}
              </div>
            </div>
            <div className="landing-reception__pass rounded-xl bg-[#181715] p-5 text-[#faf9f5] sm:p-7" data-scene-depth>
              <div className="flex items-center justify-between border-b border-white/15 pb-4"><div><p className="eyebrow text-[#e8a55a]">Pase de acceso</p><p className="mt-1 text-lg font-normal">Familia López García</p></div><QrCode className="h-10 w-10 text-white" strokeWidth={1.4} /></div>
              <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/15">
                {[[Users, '4 asistentes', 'Cupo confirmado'], [MapPin, 'Mesa 08', 'Jardín central'], [Clock3, '17:00 hrs', 'Recepción'], [ShieldCheck, 'Validado', 'Pase seguro']].map(([Icon, value, label]) => {
                  const CardIcon = Icon as typeof Users;
                  return <div key={String(value)} className="bg-[#141413] p-4"><CardIcon className="h-4 w-4 text-[#e8a55a]" /><p className="mt-5 text-sm text-white">{String(value)}</p><p className="mt-1 text-[10px] text-white/50">{String(label)}</p></div>;
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="landing-faq mx-auto grid max-w-[1200px] gap-10 px-5 sm:px-8 lg:grid-cols-[.65fr_1.35fr]">
          <div><p className="eyebrow text-[#cc785c]">Preguntas frecuentes</p><h2 className="editorial-display mt-4">Lo esencial, antes de empezar.</h2></div>
          <div className="border-t border-[#e6dfd8]">
            {FAQS.map((item, index) => {
              const isOpen = openFaq === index;
              return <div key={item.question} className="border-b border-[#e6dfd8]"><button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium">{item.question}<ChevronDown className={`h-4 w-4 shrink-0 text-[#6c6a64] transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>{isOpen && <p className="max-w-2xl pb-6 text-sm leading-6 text-[#3d3d3a]">{item.answer}</p>}</div>;
            })}
          </div>
        </section>

        <section className="landing-final border-t border-[#e6dfd8]" data-landing-scene>
          <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8">
            <div className="flex flex-col items-start justify-between gap-8 rounded-xl bg-[#cc785c] p-8 text-[#faf9f5] sm:p-12 lg:flex-row lg:items-end">
              <div className="max-w-2xl"><p className="eyebrow text-white/75">Tu gran día puede empezar aquí</p><h2 className="editorial-display mt-4">Cuéntanos tu idea. Hagamos que todos quieran estar ahí.</h2><p className="mt-4 text-sm text-white/85">Escríbenos directamente por WhatsApp y te ayudamos a elegir el diseño ideal.</p></div>
              <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className="landing-button landing-button--light shrink-0"><WhatsAppIcon size={18} /> Contactar por WhatsApp</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e6dfd8]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-10 text-sm text-[#3d3d3a] sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div><HeyDayBrand light /><p className="mt-4 max-w-sm text-xs leading-5 text-[#a09d96]">Invitaciones digitales para celebrar lo que hace única tu historia.</p><p className="mt-2 text-xs text-[#a09d96]">heyday.party</p></div>
          <div className="flex flex-wrap gap-6 text-xs"><a href="#producto">La experiencia</a><a href="#templates">Demos</a><a href="#precios">Precios</a><a href={CONTACT_URL} target="_blank" rel="noopener noreferrer">Contactar por WhatsApp</a></div>
          <p className="mono-label text-[10px] text-[#a09d96]">© 2026 HEYDAY</p>
        </div>
      </footer>

      <a className="landing-whatsapp-float" href={CONTACT_URL} target="_blank" rel="noopener noreferrer" aria-label="Contactar a HeyDay por WhatsApp">
        <WhatsAppIcon size={26} /><span>Contratar</span>
      </a>
    </div>
  );
}
