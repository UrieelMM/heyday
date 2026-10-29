# Sistema de escenas para invitaciones digitales

Esta guía describe el lenguaje visual y técnico implementado en **Royal XV Enchanted** y **Eternal Elegance**. Su propósito es permitir que los próximos templates tengan el mismo nivel de impacto y fluidez sin convertirse en clones. La unidad de diseño no es la animación aislada: es una **escena** que transforma una parte de la historia mientras el invitado avanza.

## 1. Idea rectora

La invitación debe sentirse como una experiencia editorial que se despliega, no como una lista de tarjetas con `fade-in`. Cada sección responde a una pregunta narrativa:

1. **Portada:** ¿a qué mundo estoy entrando?
2. **Historia:** ¿por qué este momento importa?
3. **Personas y tiempo:** ¿con quién y cuándo sucede?
4. **Lugar y programa:** ¿cómo viviré la celebración?
5. **Recuerdos y participación:** ¿cómo formo parte de ella?
6. **Confirmación:** ¿qué acción debo tomar?

El scroll funciona como una línea de tiempo controlada por el visitante. Los cambios principales están vinculados al progreso real del desplazamiento (`scrub`), de modo que pueden avanzar y retroceder. Las apariciones puntuales se reservan para elementos secundarios.

### Principios de dirección de arte

- **Una personalidad por evento.** El sistema de escenas es reutilizable; paleta, tipografía, fotografía, ornamentación, copy y coreografía no lo son.
- **Un gesto protagonista por sección.** Por ejemplo, una imagen se abre, una frase se ilumina o una línea se dibuja. Los demás efectos acompañan.
- **Contraste de ritmo.** Alternar escenas expansivas con pausas tipográficas o funcionales. No convertir cada bloque en otra pantalla fijada.
- **Profundidad legible.** Separar fondo, ornamentos, imagen, contenido y UI con `z-index` claros. Ningún efecto debe tapar la información o los controles.
- **Movimiento reversible.** Los efectos importantes usan progreso de scroll; los `once` son ornamentales y no deben cargar el significado principal.
- **Contenido auténtico del evento.** Nunca reciclar frases, nombres, símbolos o fotografías de otra categoría por conveniencia técnica.

## 2. Las dos expresiones actuales

| Aspecto | Royal XV Enchanted | Eternal Elegance |
| --- | --- | --- |
| Concepto | Portal a una noche de cuento, juvenil y sofisticada | Papelería editorial de boda que se abre hacia un recuerdo cinematográfico |
| Paleta | Ciruela, lavanda, rosa empolvado, destellos cálidos | Marfil, tinta oscura, bronce y dorado suave |
| Motivos | Mariposas, estrellas, órbitas y monograma XV | Botánicos lineales, anillos, diamantes y filetes de papelería |
| Hero | Arco floral hacia salón encantado; el marco crece hasta llenar la pantalla | Fotografía arqueada y marco editorial; la imagen se vuelve pantalla completa |
| Tipografía emocional | Script y serif expresivos, contraste escénico | Serif editorial y script caligráfico, composición serena |
| Voz | Primera persona de la quinceañera: “Mis XV”, “mi historia” | Voz compartida de la pareja: “nos elegimos”, “nuestra historia” |

La imagen nueva de Royal está en `public/images/royal-xv/enchanted-portal.jpg`. Se generó para conservar arcos, flores lavanda, mariposas, candelabros y luz de la galería sin duplicar ninguna de sus tres imágenes. El template usa esta imagen tanto para la portada predeterminada como para su miniatura. Las portadas personalizadas no se sustituyen.

## 3. Arquitectura de una escena

### 3.1 Hero de dos tiempos

La portada ocupa aproximadamente `165–190svh`, mientras que el escenario visible permanece `sticky` durante una ventana de alrededor de una pantalla. Esto permite un primer estado editorial, un desarrollo y un estado final sin añadir espacios vacíos artificiales.

```tsx
<section className="template-hero">
  <div className="template-hero__stage">
    <div className="template-hero__copy">...</div>
    <div className="template-hero__visual">...</div>
    <div className="template-hero__final">...</div>
  </div>
</section>
```

```css
.template-hero { height: 190svh; }
.template-hero__stage {
  position: sticky;
  top: var(--nav-height);
  height: calc(100svh - var(--nav-height));
  overflow: hidden;
  isolation: isolate;
}
```

En Royal, el arco ocupa inicialmente el lado derecho en escritorio y la mitad inferior en móvil. En Eternal, la fotografía arqueada inicia como página editorial. Ambas imágenes se expanden hacia `left: 0`, `top: 0`, `width: 100%`, `height: 100%` y `clip-path: inset(0 round 0)` mientras el copy inicial se retira. Entonces aparece un segundo mensaje breve sobre la imagen.

No fijar todas las secciones con `ScrollTrigger.pin`: el hero `sticky` es suficiente, evita saltos de altura al recalcular y convive mejor con el scroll suavizado. En las secciones posteriores, usar transformaciones con `scrub` sobre el flujo normal.

### 3.2 Capas recomendadas

1. **Fondo/base:** color, textura o gradiente de baja intensidad.
2. **Ornamentos:** SVG o CSS decorativo con `aria-hidden="true"` y `pointer-events: none`.
3. **Medio principal:** fotografía o ilustración con `object-fit: cover`, foco configurable y máscara.
4. **Copy:** titular, fecha, lugar y contexto legibles desde el primer fotograma.
5. **Acción:** CTA accesible y operativo en todo momento; no depender del final de la animación para mostrarlo.
6. **UI global:** navegación, progreso y audio por encima del escenario.

Mantener un solo dueño de cada propiedad animada. Si el hero usa `scale` o `yPercent` en su timeline, excluir esa imagen de parallax genérico. Si una tarjeta usa `x`, `y` y `opacity` con `scrub`, quitarle la clase de `fade-in` inicial para evitar que dos tweens se contradigan.

## 4. Gramática de movimiento

| Recurso | Uso | Rango orientativo |
| --- | --- | --- |
| Expansión de máscara | Portada, foto de lugar, mapa | `inset(12–18%)` a `inset(0%)`; arco a esquinas rectas |
| Escala editorial | Titulares, tarjetas, retratos | `0.85–0.9` a `1`; evitar zooms exagerados |
| Traslación | Capas que entran o se separan | `40–110px` según tamaño y peso visual |
| Rotación | Tarjetas fotográficas, motivos | `±3–20deg`; cerrar en un ángulo discreto |
| Opacidad progresiva | Copy que cede protagonismo | De `1` a `0` solo si otra capa toma el relevo |
| Parallax | Imágenes y ornamentos de fondo | `±3–12%` o `±24px`, nunca sobre texto funcional |
| Dibujo de línea | Botánicos, anillos, cronología | `strokeDashoffset` o `scaleY` ligado al scroll |
| Texto por palabras | Citas y manifiestos | Opacidad baja a `1`, con `stagger` pequeño y `scrub` |

Usar `ease: 'none'` para propiedades controladas por el scroll; la inercia la aporta `scrub: 0.5–1`. Para la entrada después de abrir el sobre sí convienen curvas `power3.out` y tiempos de aproximadamente `0.8–1.4s`. Una sección no necesita todos los efectos de la tabla.

## 5. Coreografía por capítulo

### Portada

- La entrada del sobre revela el primer estado del hero.
- El titular llega en capas; la imagen enmarcada establece la identidad.
- En el primer tramo de scroll se retira el copy y el marco se expande.
- En el tramo final aparece una frase corta que hace puente hacia la historia.
- La imagen no debe quedar vacía, oscura o ilegible al cambiar entre relación de aspecto móvil y escritorio.

### Historia

- Una cita amplia funciona como pausa después del hero.
- Las palabras cambian de opacidad de forma progresiva. El texto completo se mantiene accesible mediante `aria-label` en el `blockquote` y los spans visuales se marcan `aria-hidden`.
- Los capítulos secundarios entran después de la cita, no a la vez.

### Familia y cuenta regresiva

- Las tarjetas familiares se enderezan y se acercan con el scroll. La ornamentación permanece tenue.
- Los números de la cuenta regresiva entran escalonados, pero la actualización del contador sigue siendo independiente y ocurre cada segundo.
- Evitar animar el valor numérico en cada `tick`; animar su contenedor.

### Lugar, mapa y programa

- Fotografías y mapas pueden revelarse con un recorte en arco que se abre a rectángulo.
- La dirección y los botones de Uber, Apple Maps, Google Maps y Waze deben seguir visibles y clicables sin esperar una animación.
- El programa combina una línea que se dibuja con hitos que se aproximan. El orden cronológico nunca cambia.

### Galería, álbum y participación

- La galería se compone como fotografías que se acomodan, no como un carrusel obligatorio.
- Los elementos decorativos pueden girar o flotar lentamente; las imágenes principales mantienen el foco y sus leyendas.
- El álbum muestra honestamente su estado: selección y vista previa local en la demo, sin afirmar que ya se subieron archivos al servidor.
- Formularios, votaciones y CTAs no deben moverse mientras la persona está interactuando con ellos.

### RSVP

- La tarjeta se acerca y gana nitidez al entrar en viewport.
- Al llegar a los campos, la animación ya debe estar completa. Nunca escalar el formulario mientras se escribe.
- El mensaje de confirmación, los pases y las capacidades reales del backend deben describirse con precisión.

## 6. Implementación con GSAP, ScrollTrigger y Lenis

Los dos templates usan las librerías instaladas: `gsap`, `ScrollTrigger`, `@gsap/react` y el proveedor de scroll suavizado con Lenis. `motion/react` conserva las transiciones del sobre. No añadir otra librería para repetir estas funciones.

```tsx
useGSAP(() => {
  const root = rootRef.current;
  if (!root || !isOpen) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const visual = root.querySelector('.template-hero__visual');
  const hero = root.querySelector('.template-hero');
  if (!hero || !visual) return;

  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,
    },
  })
    .to(root.querySelector('.template-hero__copy'), {
      yPercent: -20, opacity: 0, duration: 0.55,
    }, 0)
    .to(visual, {
      left: '0%', top: '0%', width: '100%', height: '100%',
      clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1,
    }, 0);
}, { scope: rootRef, dependencies: [isOpen] });
```

El snippet es un patrón, no un componente para pegar sin ajustes. Consultar nodos reales antes de crear cada timeline y comprobar `sectionsOrder`: el builder puede desactivar secciones. En Eternal también se detecta un contenedor `data-invitation-scroller` cuando existe y se pasa como `scroller` a cada trigger. En el sitio público, Lenis controla el scroll nativo y llama `ScrollTrigger.update`.

### Puntos de integración

- **Contenido:** `src/lib/templates/templates-catalog.ts` define configuración inicial, portada y copy por categoría.
- **Render:** `src/components/invitation/core/InvitationRenderer.tsx` elige la experiencia correcta.
- **Experiencias:** `src/components/invitation/templates/RoyalXVEnchantedExperience.tsx` y `EternalEleganceExperience.tsx` contienen estructura y timelines.
- **Estilos:** sus archivos CSS homónimos definen composición, capas, puntos de ruptura y reducción de movimiento.
- **Assets:** guardar imágenes finales en `public/images/<template>/`; no depender de una ruta temporal de generación.
- **Configuraciones guardadas:** migrar solo valores antiguos reconocibles, sin sobrescribir una portada o texto personalizado.

## 7. Responsividad y accesibilidad

- Diseñar el primer fotograma para `320px`, móvil común, tablet y escritorio. El hero cambia de composición: no se limita a escalar un layout de dos columnas.
- Usar `svh` para escenarios con navegación móvil y `clamp()` para tipografía y márgenes.
- Proteger `scrollWidth <= innerWidth`. La ornamentación puede salir visualmente del lienzo, pero su contenedor debe recortarla.
- Mantener CTA y navegación fuera de zonas de recorte. Revisar también alturas de escritorio bajas, no solo anchos.
- El estado final de una escena debe estar disponible aunque la persona salte mediante un enlace ancla.
- Respetar `prefers-reduced-motion`: desactivar GSAP, dejar palabras totalmente visibles y convertir el hero largo/sticky en una sección estática de una pantalla.
- Las imágenes tienen `alt` descriptivo; el SVG decorativo es invisible para lectores de pantalla.
- Si se oscurece una foto para colocar texto, verificar contraste en todo el recorrido, no solo en el fotograma final.

## 8. Rendimiento

- Priorizar `transform` y `opacity`; usar `clip-path` solo en elementos grandes puntuales, no en decenas de tarjetas a la vez.
- Evitar blur animado de pantalla completa y filtros pesados sobre `iframe`.
- Optimizar assets finales. La nueva portada Royal se convirtió a JPEG de ~852 KB desde el PNG generado de ~3.3 MB.
- Cargar la portada con prioridad; dejar fotos posteriores con `loading="lazy"`.
- Usar `will-change` solo en los elementos que realmente se transforman y quitarlo si una sección deja de animarse.
- Registrar triggers solo si la sección existe; revisar que un cambio en el builder no deje referencias a nodos eliminados.
- Aprovechar `useGSAP` para limpiar timelines y ScrollTriggers al desmontar o reconstruir la experiencia.

## 9. Receta para un nuevo template

1. Escribir una frase conceptual de una línea y definir tres rasgos visuales propios del evento.
2. Elegir un gesto de portada específico: cortina, portal, página, máscara, escenario, constelación, etc. No reutilizar automáticamente el mismo arco.
3. Preparar fotografía/ilustración con un foco que resista recortes móvil y escritorio.
4. Componer el primer fotograma completo sin JavaScript: título, fecha, lugar y CTA deben funcionar estáticos.
5. Añadir la escena sticky del hero y su segundo estado, con un puente claro hacia la historia.
6. Asignar **una** transformación protagonista a cada sección. Escribir un mapa de escenas antes de programar.
7. Implementar triggers locales al template y condicionales a secciones activas; evitar selectores globales compartidos.
8. Probar scroll hacia abajo, hacia arriba y salto por anclas; comprobar que `scrub` no deja elementos invisibles.
9. Validar `320px`, `390–460px`, tablet, escritorio amplio y escritorio bajo; medir `scrollWidth`.
10. Probar `prefers-reduced-motion`, teclado, foco, imágenes lentas y formularios.
11. Ejecutar `npm run typecheck` y `npm run build`; revisar consola del navegador y el resultado real.

### Lista de aceptación

- [ ] El primer fotograma comunica el evento sin hacer scroll.
- [ ] Al menos el hero y tres capítulos tienen transformaciones ligadas al progreso, no solo `fade-in`.
- [ ] Cada escena tiene inicio, desarrollo y cierre visual claro.
- [ ] El template conserva copy, paleta, motivos y fotos propios de su categoría.
- [ ] No hay colisiones entre timelines, `hover`, revelados genéricos y scroll suave.
- [ ] CTA, mapas, formularios y navegación son utilizables en todos los tamaños.
- [ ] No hay desbordamiento horizontal ni secciones vacías al desactivar módulos.
- [ ] La experiencia estática con movimiento reducido sigue siendo completa.
