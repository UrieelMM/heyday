# Sistema de Escenas Dinámicas v2.0 — Guía Mobile-First, Profundidad Multicapa y Prompt Maestro

> Este documento evoluciona `SCROLL_SCENES.md` a partir de los rediseños integrales de **Mini Cosmos** (`src/components/invitation/templates/MiniCosmosExperience.tsx`), **Atelier XV** (`src/components/invitation/templates/AtelierXVExperience.tsx`), **Ritmo de Dos** (`src/components/invitation/templates/RitmoDeDosExperience.tsx`), **Marea Azul** (`src/components/invitation/templates/MareaAzulExperience.tsx`), **Neon XV Euphoria** (`src/components/invitation/templates/NeonXVEuphoriaExperience.tsx`) y **Eternal Elegance** (`src/components/invitation/templates/EternalEleganceExperience.tsx`), incorporando patrones de dinamismo y profundidad de **[urieel.dev](https://urieel.dev/)** y **[ywstudio.com.mx](https://www.ywstudio.com.mx/)**. Incluye los ajustes de **Rodeo Rosa** para suavizar el movimiento, controlar las revelaciones en móvil y mantener el contenido legible durante el scroll.

---

## 1. Idea rectora y evolución respecto a `SCROLL_SCENES.md`

Una invitación digital memorable no es una lista vertical de bloques con `fade-in`, ni una plantilla genérica donde solo cambia el color de fondo. Es una **experiencia escénica e interactiva pensada primero para móvil (`320px–430px`)**, donde más del 85% de los invitados abren su enlace desde WhatsApp.

Cada capítulo responde a una pregunta narrativa y utiliza el desplazamiento (`scrub`) como una línea de tiempo reversible:

1. **Apertura interactiva (Sobre / Pase / Escotilla):** ¿Qué objeto físico o ritual estoy abriendo para entrar al evento?
2. **Portada en dos tiempos (`sticky`):** ¿A qué universo visual estoy entrando y cómo se transforma al deslizar?
3. **Banda cinética de ritmo (`marquee`):** ¿Cuál es el pulso y la energía de la celebración?
4. **Manifiesto / Historia con dibujo vectorial:** ¿Por qué este momento es irrepetible?
5. **Sección de inmersión temática (Estaciones / Experiencia del día):** ¿Qué viviremos durante el evento más allá de los datos básicos?
6. **Personas y cuenta regresiva:** ¿Con quiénes celebramos y cuánto falta?
7. **Coordenadas, mapa interactivo y plan de vuelo:** ¿Cómo llego en 1 clic y cuál es la ruta minuto a minuto?
8. **Archivo visual (Galería) y equipamiento (Dress code):** ¿Cómo luce este mundo y cómo me preparo?
9. **Detalles (Regalos / Hospedaje) y participación social (Álbum / Música):** ¿Cómo comparto recuerdos con los anfitriones?
10. **Confirmación y Pase QR:** ¿Cómo aseguro mi lugar y obtengo mi acceso digital?

---

## 2. Diagnóstico y ajustes realizados en **Mini Cosmos**

### 2.1 Problemas detectados en la versión anterior

| Problema reportado | Causa técnica en la versión anterior | Solución implementada en `MiniCosmosExperience` |
| --- | --- | --- |
| **1. El cohete estaba mal diseñado y se veía deforme** | `public/images/mini-cosmos/cover.svg` usaba trazos `path` asimétricos (`M350 870Q445 700 600 590L700 690...`) dibujados sin eje de simetría, produciendo un fuselaje chueco y aletas desproporcionadas. | Se creó el componente vectorial `<MissionRocket />` (`viewBox="0 0 240 340"`, eje de simetría exacto en `x = 120`) con fuselaje aerodinámico, cono terracota, aletas espejo, escotilla con remaches, reflejo especular y pluma de propulsión animada. Además, se regeneró `cover.svg` y se crearon 5 ilustraciones 3D cohesivas (`astronaut.jpg`, `keyart.jpg`, `play.jpg`, `cake.jpg`, `planets.jpg`). |
| **2. Poca profundidad y dinamismo en el scroll** | `Mini Cosmos` compartía `NewSceneHero.tsx` y `new-scenes.ts` con otros 3 templates usando únicamente un símbolo `✦` de texto y traslaciones simples (`y: 58 -> 0`). | Se construyó una experiencia dedicada (`MiniCosmosExperience.tsx`) con **5 planos de profundidad (`z-index`)**, despegue diagonal del cohete ligado a `scrub`, bandas cinéticas (`<KineticMarquee />`), constelación geométrica con trazado `strokeDashoffset`, sello giratorio `<textPath>` y un cohete viajero que recorre la línea del tiempo. |
| **3. Elementos descentrados en móvil y escritorio** | En `new-scenes.css`: `.ns-hero__media { left: 30%; width: 58vw }` sumaba `88%` (dejando `30%` a la izquierda y `12%` a la derecha). En `InvitationRenderer.tsx`: `.st-family` forzaba `sm:grid-cols-3`, `.st-locations` forzaba `md:grid-cols-2` y `.st-gallery` forzaba `md:grid-cols-4` aunque hubiera 1 o 2 elementos, dejándolos pegados a la izquierda. | En móvil, la escotilla usa `left: 19%; width: 62%` (`19% + 62% + 19% = 100%`), logrando centrado matemático exacto sin usar `transform: translateX(-50%)` que colisionaría con GSAP al animar hacia `left: 0%; width: 100%`. Todo el copy, chips, botones, encabezados y grillas usan contenedores flex/grid auto-centrados (`justify-content: center`, `align-items: center`, `text-align: center`). |
| **4. Invitación con pocas secciones y apariencia sencilla** | Tenía desactivadas secciones por defecto, solo 1 grupo familiar, 2 imágenes SVG planas en galería y carecía de capítulos visuales propios. | Se creó el capítulo **Centro de Entrenamiento: Las 4 Estaciones de la Misión** (con tarjetas `sticky` apiladas en móvil y Bento en escritorio), se amplió la galería a 4 escenas 3D, se enriqueció la tripulación a 3 rangos, el plan de vuelo a 4 fases, se activó la cápsula de regalos, el álbum compartido, sugerencias musicales y dos bandas cinéticas de telemetría. |
| **5. Impacto en móvil** | El texto quedaba alineado a la izquierda arriba mientras el círculo quedaba desplazado a la derecha abajo, desperdiciando el viewport vertical `390×844`. | Se rediseñó bajo arquitectura **Mobile-First**: barra de navegación tipo píldora flotante translúcida, hero vertical centrado con chips de telemetría, tarjetas apiladas (`position: sticky` en móvil), consola T-Minus de 2×2 pods circulares en móvil y botones de ruta de ancho completo. |
| **6. Atelier XV: Ilustración fantasmal ("La Llorona")** | `public/images/atelier-xv/cover.svg` mostraba una silueta sin rostro con cabeza circular azul oscuro (`<circle cx="800" cy="275" r="100" fill="#152c54"/>`) y túnica blanca triangular flotando en un pasillo frío. | Se eliminó por completo la silueta fantasmal y se creó [`AtelierXVExperience.tsx`](file:///Users/urieeldev/Documents/Codes/invitacionesdigitales/src/components/invitation/templates/AtelierXVExperience.tsx) con 5 fotografías editoriales luminosas de alta costura (`cover.jpg`, `runway.jpg`, `atelier.jpg`, `cake.jpg`, `toast.jpg`), el vector simétrico `<CoutureBow />` con broche diamante, sello giratorio `<RotatingCoutureSeal />` y patronaje arquitectónico `<AtelierPatternBackdrop />`. |
| **7. Ritmo de Dos: Vinilo plano y sin escena dedicada** | Usaba `NewSceneHero.tsx` genérico con un círculo SVG estático (`cover.svg`), sin brazo de tornamesa, sin padres ni regalos habilitados y con solo 2 bloques de texto. | Se creó [`RitmoDeDosExperience.tsx`](file:///Users/urieeldev/Documents/Codes/invitacionesdigitales/src/components/invitation/templates/RitmoDeDosExperience.tsx) y [`ritmo-de-dos.css`](file:///Users/urieeldev/Documents/Codes/invitacionesdigitales/src/components/invitation/templates/ritmo-de-dos.css) con apertura de funda de vinilo 33⅓ RPM + boleto perforado, ventana circular de vinilo que se expande a pantalla completa con centrado matemático (`left: 19%; width: 62%`), brazo de tornamesa `<TurntableTonearm />` que pivota al hacer scroll, ondas acústicas `<AcousticWaveBackdrop />`, sección **Los 4 Tracks de Nuestra Noche** con tarjetas `sticky`, setlist con vinilo viajero `<VinylRecordDisc />` y 5 fotografías analógicas 35mm (`cover.jpg`, `dance.jpg`, `venue.jpg`, `vinyl.jpg`, `toast.jpg`). |
| **8. Marea Azul: Velero asimétrico y plantilla incompleta** | `public/images/marea-azul/cover.svg` tenía un bote de triángulos desalineados (`M635 798Q790 842 940 792...`), usaba `NewSceneHero.tsx` genérico y tenía deshabilitados padres, regalos y hospedaje. | Se creó [`MareaAzulExperience.tsx`](file:///Users/urieeldev/Documents/Codes/invitacionesdigitales/src/components/invitation/templates/MareaAzulExperience.tsx) y [`marea-azul.css`](file:///Users/urieeldev/Documents/Codes/invitacionesdigitales/src/components/invitation/templates/marea-azul.css) con el velero simétrico `<CoastalSailboat />` (`x = 120`), medallón de rosa de los vientos `<CompassRoseMedallion />`, sello giratorio `<RotatingHorizonSeal />`, carta náutica `<NauticalChartBackdrop />` con `strokeDashoffset`, capítulo **Las 4 Calas de Nuestra Celebración**, ruta con velero viajero y 5 fotografías editoriales costeras (`cover.jpg`, `sail.jpg`, `venue.jpg`, `table.jpg`, `toast.jpg`). |
| **9. Neon XV Euphoria: Hero genérico con foto de boda por defecto** | Compartía `SignatureHero.tsx` con bodas usando 3 etiquetas `<i>` vacías como órbitas y en `createDefaultInvitationConfig` heredaba la foto de novios de Unsplash (`1519741497674`) como portada de XV años. | Se creó [`NeonXVEuphoriaExperience.tsx`](file:///Users/urieeldev/Documents/Codes/invitacionesdigitales/src/components/invitation/templates/NeonXVEuphoriaExperience.tsx) y [`neon-xv-euphoria.css`](file:///Users/urieeldev/Documents/Codes/invitacionesdigitales/src/components/invitation/templates/neon-xv-euphoria.css) con la corona de prisma neón simétrica `<NeonCrownPrism />` (`x = 120`), ecualizador radial interactivo de 24 barras `<LaserEqualizerOrb />`, sello `<RotatingVipSeal />`, retícula láser `<SynthwaveLaserGrid />`, capítulo **Los 4 Beats de Nuestra Noche** con monitor interactivo y 5 fotografías nocturnas de XV (`cover.jpg`, `stage.jpg`, `dancefloor.jpg`, `glow.jpg`, `toast.jpg`). |
| **10. Eternal Elegance: Imágenes externas de Unsplash, hero descentrado (`left: 55%`) y sin capítulo de inmersión temática** | Usaba URLs remotas de Unsplash, rama botánica asimétrica, hero desplazado a la derecha (`left: 55%; width: 39%`), solo 2 bloques de historia sin fotos y carecía de sección de experiencia de la velada, marquesinas y viajero en el programa. | Se rediseñaron [`EternalEleganceExperience.tsx`](file:///Users/urieeldev/Documents/Codes/invitacionesdigitales/src/components/invitation/templates/EternalEleganceExperience.tsx) y [`eternal-elegance.css`](file:///Users/urieeldev/Documents/Codes/invitacionesdigitales/src/components/invitation/templates/eternal-elegance.css) con arco de cantera matemáticamente centrado (`left: 19%; width: 62%` en desktop y `left: 7%; width: 86%` en mobile), blasón simétrico `<HaciendaCrestMedallion />` (`x = 120`), arco `<BotanicalArchEmblem />`, sello `<RotatingHeirloomSeal />`, rosetón `<ArchitecturalRoseWindow />`, capítulo **Los 4 Tiempos de Nuestra Velada** (`#ee-moments`) y 5 fotografías editoriales de hacienda en `public/images/eternal-elegance/` (`cover.jpg`, `ceremony.jpg`, `hacienda.jpg`, `vows.jpg`, `toast.jpg`). |

---

## 3. Patrones de dinamismo adoptados de las referencias

### 3.1 De `urieel.dev`
1. **Manifiesto con geometría SVG reactiva al scroll (`<ConstellationBackdrop />`):**
   - Detrás de la cita principal (`#mc-story`), un sistema de anillos orbitales y constelaciones se escala (`scale: 0.76 -> 1.06`), rota (`-18deg -> 12deg`) y dibuja sus trazos (`strokeDasharray` / `strokeDashoffset`) con `scrub` mientras las palabras del manifiesto se iluminan una por una.
2. **Tarjetas apiladas en viewport móvil (`sticky` stack):**
   - En la sección **Las 4 Estaciones de la Misión (`#mc-missions`)**, las tarjetas en móvil usan `position: sticky; top: calc(74px + var(--mc-stack-index) * 10px)`, creando un efecto táctil de baraja espacial conforme el invitado desliza.
3. **Píldoras de telemetría con indicador en vivo:**
   - Encabezados de sección con código de capítulo (`CAPÍTULO 01`, `TELEMETRÍA T-MINUS`, `COORDENADAS GPS`) y punto luminoso pulsante (`mc-pulse-dot`).

### 3.2 De `ywstudio.com.mx`
1. **Sello circular giratorio con `<textPath>` (`<RotatingMissionSeal />`):**
   - Alrededor de la escotilla principal gira continuamente un anillo tipográfico SVG (`MISIÓN CUMPLEAÑOS ★ LEO ★ VUELTA AL SOL #06 ★`) que aporta movimiento orgánico constante incluso antes de hacer scroll.
2. **Transiciones de hoja redondeada con sombra profunda (`.mc-sheet`):**
   - Las secciones pares emergen como láminas físicas con `border-radius: 40px 40px 0 0` y `box-shadow: 0 -24px 60px rgba(4, 9, 25, 0.45)`, separando claramente cada capítulo.
3. **Bandas cinéticas infinitas (`<KineticMarquee />`):**
   - Separadores horizontales con animación continua (`translate3d(-33.333%, 0, 0)`) y `mask-image` difuminado en los bordes laterales para dar ritmo editorial entre escenas densas.

### 3.3 Fondos con identidad gráfica en todas las escenas
1. **Ninguna sección debe quedar como un bloque de color vacío.** En inmersión temática, familia, cuenta regresiva, ubicaciones, itinerario, galería, vestimenta, regalos, participación social y RSVP, añade motivos reconocibles del universo visual del template: ilustraciones, figuras vectoriales, texturas o patrones. Deben acompañar la información sin tapar titulares, tarjetas, mapas ni controles.
2. **Cada escena necesita su propia composición.** Alterna tipo de motivo, cantidad, escala, posición y profundidad. Evita repetir dos adornos en las mismas esquinas a lo largo de toda la página. La sección de inmersión temática también requiere un fondo escénico, aunque sus tarjetas ya contengan imágenes.
3. **El movimiento debe ser perceptible y variado.** Combina trayectorias distintas de flotación, giro, deriva o cambio de escala con parallax reversible ligado al scroll (`scrub`) en las escenas protagonistas. Anima capas separadas cuando convivan movimiento continuo y scroll para que sus transformaciones no se sobrescriban.
4. **Conserva legibilidad y rendimiento.** Sitúa los gráficos detrás del contenido (`isolation`, `z-index`, `pointer-events: none`), recorta dentro de la escena, ajusta tamaño/opacidad/posición para `320px–430px` y desactiva la animación con `prefers-reduced-motion`. Comprueba que no haya desbordamiento horizontal.

### 3.4 Movimiento suave y revelaciones en móvil

Para el manifiesto, usa [`createQuoteReveal`](src/components/invitation/templates/quote-reveal.ts) con el `blockquote` como disparador. Coloca las palabras y los trazos de la ilustración en esa misma línea de tiempo para que la última línea y el dibujo estén completos al entrar en pantalla, aunque debajo haya tarjetas o cambie el número de líneas en móvil. Prueba también el scroll inverso y la llegada desde un enlace interno.

**Rodeo Rosa** usa una coreografía dedicada para distinguir las escenas con gestos propios de la temática. El boleto se separa en dos, las estaciones abren sus puertas y el álbum revela una tira de película. Los fondos se mueven en planos separados del contenido. [Escenas de Rodeo Rosa](src/components/invitation/templates/rodeo-rosa-scenes.ts) · [Estilos de Rodeo Rosa](src/components/invitation/templates/rodeo-rosa.css)

| Escena | Ajuste aplicado en Rodeo Rosa | Criterio para futuros templates |
| --- | --- | --- |
| Manifiesto | La cita es el disparador. El efecto va de `top bottom` a `bottom bottom` con `scrub: true`, de modo que la última palabra recupera toda su opacidad cuando entra la última línea. | Ajusta el recorrido al texto que se anima. Comprueba también el estado al llegar desde un enlace interno. |
| Tarjetas de historia y vestimenta | Las tarjetas de «Botas y moños» suben 12 px y sus fotos recuperan saturación. En «Saca tus botas favoritas», las tarjetas ganan opacidad y el borde de costura se revela desde el centro. | Escoge un gesto por grupo y deja que se desarrolle a lo largo del scroll. Un detalle de la foto o del borde puede aportar profundidad con la tarjeta casi inmóvil. |
| Telones de las estaciones | Cada foto tiene un telón de dos hojas. En móvil, ambas empiezan en `xPercent: 0`, con un pequeño solape en el centro y esquinas internas rectas. Cada tarjeta `sticky` usa su propio marcador en el flujo (`.rr-station__anchor`, de altura cero) justo antes de la tarjeta. La apertura se distribuye de `top 42%` a `top 17%` con `scrub: .22`. | Deja que se vea el telón cerrado cuando la foto entra en pantalla. Mide el avance desde un marcador que conserve su posición original aunque la tarjeta se fije. Completa la apertura de cada foto antes de que la siguiente la cubra. |
| Cuenta regresiva | Los números y las etiquetas permanecen fijos y pasan de opacidad `.9` a `1`. El arco SVG, con `pathLength="1"`, anima `attr: { 'stroke-dashoffset': .36 }` hacia `0` de `top bottom` a `bottom 58%` con `scrub: .5`. | Mantén el reloj legible y anima el arco como adorno. Usa el atributo SVG para conservar los valores fraccionarios del trazo. Mantén el avance del scroll independiente de la actualización de los segundos. |
| Itinerario, álbum y confirmación | Las tarjetas del itinerario entran con un movimiento corto dentro de su columna. El álbum presenta las instrucciones de carga como nota secundaria y el pase anima su sello decorativo mientras los campos permanecen fijos. | Comprueba el ancho durante la transición, conserva la jerarquía del texto y reserva el movimiento para capas que no interfieran con mapas, enlaces ni formularios. |

Los valores de `start`, `end` y `scrub` son puntos de partida. Ajusta primero cuánto se mueve el elemento y en qué tramo de pantalla se verá el gesto. Usa curvas suaves como `sine.inOut` y un `scrub` numérico corto cuando ayude a amortiguar el movimiento. Comprueba el resultado al deslizar despacio, invertir el sentido y cambiar el tamaño de la ventana con la escena a medio recorrido.

Si una animación depende de medidas, recalcula sus disparadores cuando cambie el tamaño del contenido por fotos, fuentes o ediciones. En Rodeo Rosa, `gsap.matchMedia()` actualiza el comportamiento por breakpoint y preferencia de movimiento, y `ResizeObserver` solicita el recálculo de `ScrollTrigger`. Con movimiento reducido, las fotos de las estaciones quedan visibles y las tarjetas siguen el flujo de la página.

---

## 4. Regla de oro para el centrado matemático con GSAP

Uno de los errores más frecuentes al combinar CSS responsivo con `ScrollTrigger` es centrar un elemento con `left: 50%; transform: translateX(-50%)` y luego animar `left: '0%', width: '100%'` en GSAP. Durante la interpolación, el `-50%` residual desplaza el elemento fuera de centro.

### Solución obligatoria en todos los templates:
- **En el Hero (`visual` / máscara expansible):** definir la posición inicial usando porcentajes simétricos cuya suma sea `100%`:
  ```css
  /* Móvil: 19% + 62% + 19% = 100% -> Centrado exacto sin translateX */
  .template-hero__visual {
    left: 19%;
    width: 62%;
    top: 52%;
    height: 36%;
  }
  ```
  Así, cuando GSAP anima hacia `left: '0%', top: '0%', width: '100%', height: '100%'`, el elemento permanece **100% centrado en cada fotograma del `scrub`**.
- **En grillas de 1, 2, 3 o N elementos (Padres, Ubicaciones, Galería, Regalos):**
  - Nunca dejar `grid-template-columns: repeat(3, 1fr)` fijo si el usuario puede tener solo 1 o 2 tarjetas.
  - Usar `display: flex; flex-wrap: wrap; justify-content: center` con `flex: 1 1 260px; max-width: 340px`, o `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))` con `justify-items: center` y `margin-inline: auto`.

---

## 5. Arquitectura de capas y escenas de **Mini Cosmos**

| Escena | Selector / Destino Editor | Gesto protagonista en Scroll (`scrub`) | Elementos de profundidad |
| --- | --- | --- | --- |
| **0. Apertura** | `.mc-opening` (`envelope`) | Despegue del `<MissionRocket />` + separación del boleto perforado + confeti | Estrellas radiales, 2 órbitas punteadas, `<RingedPlanet />`, boleto con muescas |
| **1. Portada Sticky** | `#mc-hero` (`hero`) | Escotilla circular se expande a pantalla completa (`19% -> 0%`, `62% -> 100%`) mientras el cohete despega en diagonal y emerge la tarjeta puente | Retícula de telemetría, watermark gigante (`06`), `<RotatingMissionSeal />`, 2 planetas 3D, `<MissionRocket />` con estela |
| **Interludio 1** | `.mc-marquee` | Marquesina cinética continua con `mask-image` lateral | Tipografía display + estrellas `<StarSparkle />` |
| **2. Bitácora** | `#mc-story` (`quoteStory`) | Constelación SVG se dibuja (`strokeDashoffset`) y rota mientras las palabras se iluminan una a una; tarjetas entran con rotación 3D | `<ConstellationBackdrop />`, palabras `.mc-story__word`, 3 tarjetas `FASE 01–03` |
| **3. Estaciones** | `#mc-missions` | 4 tarjetas de misión se apilan con `position: sticky` en móvil y revelan ilustraciones 3D | Planeta con parallax, 4 ilustraciones (`astronaut`, `play`, `planets`, `cake`) |
| **4. Tripulación** | `#mc-family` (`vipParents`) | Tarjetas de capitanes, comandantes y escuadrón se enderezan (`±5deg -> 0deg`) y escalan | Insignias de rango, borde luminoso menta, sombra sólida |
| **5. Cuenta T-Minus** | `#mc-countdown` (`countdown`) | 4 cápsulas circulares (`T-D`, `T-H`, `T-M`, `T-S`) entran en espiral (`rotate: -10 -> 0`, `scale: 0.76 -> 1`) | Consola de propulsión, indicador en vivo pulsante, botones de calendario |
| **6. Base Espacial** | `#mc-locations` (`locations`) | Ventana fotográfica abre su `clip-path` redondeado (`inset(14% 12%) -> inset(0%)`) | Ilustración `keyart.jpg`, mapa interactivo embebido, 4 botones GPS (Maps, Waze, Apple, Uber) |
| **7. Plan de Vuelo** | `#mc-timeline` (`timeline`) | El riel luminoso crece (`scaleY: 0 -> 1`) y un mini `<MissionRocket />` avanza por la línea junto a cada hito | Riel orbital, cohete viajero `.mc-timeline__rocket-runner`, nodos numerados `01–04` |
| **8. Exploraciones** | `#mc-gallery` (`gallery`) | Fotografías tipo polaroid espacial se acomodan desde ángulos dispersos (`±7deg -> ∓1.5deg`) | Planeta terracota con parallax, 4 tarjetas con etiqueta `REGISTRO 01–04` |
| **9. Equipamiento** | `#mc-dress` (`dressCode`) | Tarjetas de Pequeños Astronautas y Tripulación Adulta giran en perspectiva (`rotateY: ±16deg -> 0deg`) | Iconos circulares, checklist de misión (`✓ Tenis cómodos`), muestras de color |
| **10. Regalos y Social** | `#mc-gifts`, `#mc-social` | Elevación progresiva de paneles de regalos, álbum compartido y solicitudes musicales | Cápsula de sobres, copia de CLABE en 1 clic, `SharedAlbum`, `SocialFeatures`, hashtag |
| **11. Pase QR** | `#mc-rsvp` (`rsvp`) | El pase de abordaje se acerca y queda 100% estático antes de interactuar con los campos | Encabezado de control de vuelo, formulario accesible y generador de código QR |

---

## 6. Prompt Maestro para diseñar o rediseñar los demás templates

Copia y utiliza este prompt cada vez que vayas a crear un nuevo template o rediseñar uno existente del catálogo (`Marea Azul`, `Ritmo de Dos`, `Atelier XV`, `Boho Terracotta`, `Modern Minimal Noir`, `Neon XV Euphoria`, `Golden Jubilee`, `Fiesta Kids Adventure`, `Celestial Baptism`, `Sweet Oh Baby`, `Grad Gala Night`):

```markdown
Actúa como Director de Arte Interactivo y Desarrollador Frontend Senior especializado en GSAP ScrollTrigger, Lenis y experiencias Mobile-First.

Tu objetivo es rediseñar el template `[NOMBRE_DEL_TEMPLATE]` (`[TEMPLATE_ID]`, categoría `[CATEGORIA]`) siguiendo la arquitectura de `MiniCosmosExperience.tsx`, `RoyalXVEnchantedExperience.tsx` y `EternalEleganceExperience.tsx`. Usa la sección 3.4 de `SCROLL_SCENES_V2.md` y `rodeo-rosa-scenes.ts` como referencia para el ritmo de las revelaciones.

### 1. Identidad visual y activos gráficos a medida (Cero gráficos deformes o genéricos)
- Diseña al menos **3 componentes SVG propios y matemáticamente simétricos** para la temática del template:
  1. Un **motivo protagonista multicapa** (con gradientes, luces especulares y sub-elementos animables por CSS/GSAP).
  2. Un **sello circular giratorio (`<textPath>`)** con palabras clave auténticas del evento.
  3. Un **fondo geométrico / botánico / arquitectónico con trazos `strokeDasharray` / `strokeDashoffset`** que se dibuje progresivamente con el scroll en la sección de Historia/Manifiesto.
- Genera y optimiza (con `sharp` a JPEG/WebP `< 110 KB`) un set cohesivo de **4 a 5 ilustraciones o fotografías editoriales** en `public/images/[TEMPLATE_ID]/` para la portada, la sección de experiencia temática, las ubicaciones y la galería.
- Prepara encuadres de portada propios para móvil y escritorio. Usa `HeroMedia` con `desktopSrc` para los recursos de portada por defecto y conserva los medios personalizados que lleguen desde `InvitationConfig`.
- Diseña motivos ambientales propios para las escenas con fondos de color sólido. Distribúyelos de forma diferente en cada capítulo, con varias escalas y movimientos (flotación, giro, deriva, parallax de scroll); incluye la sección de inmersión temática. Mantén estos gráficos detrás de textos y controles, adapta la composición móvil y respeta `prefers-reduced-motion`.

### 2. Impacto Mobile-First (`320px`, `375px`, `390px`, `430px`) y centrado matemático
- Diseña primero para el viewport móvil (`390 × 844 px`) donde la mayoría de los invitados abren la invitación.
- **Regla estricta de centrado:** Todos los encabezados, badges, textos de portada en móvil, chips de fecha/lugar, botones, tarjetas de familia, pods de cuenta regresiva, tarjetas de ubicación, galería y formulario RSVP deben estar **100% centrados horizontalmente**.
- En la máscara/imagen expansible del Hero, define la posición inicial en móvil usando porcentajes simétricos (`left: X%; width: (100 - 2X)%`) sin depender de `transform: translateX(-50%)`, para que la animación GSAP hacia `left: '0%', top: '0%', width: '100%', height: '100%'` mantenga el centrado exacto en cada fotograma.
- En todas las grillas (Familia, Ubicaciones, Galería, Regalos, Hospedaje), usa layouts auto-centrados (`justify-content: center` o `auto-fit`) para que 1, 2, 3 o 4 elementos se vean siempre equilibrados y nunca queden pegados a la izquierda.
- Garantiza `scrollWidth <= innerWidth` en todos los tamaños (`overflow-x: clip`).

### 3. Arquitectura de escenas y dinamismo con Scroll (`GSAP + ScrollTrigger`)
Implementa un componente dedicado `[NombreTemplate]Experience.tsx` y su hoja `[template-id].css` con al menos **11 escenas diferenciadas**:
1. **Apertura temática interactiva (`data-editor-section="envelope"`):** Un ritual de entrada propio de la categoría (sobre lacrado, pase de abordaje, boleto de concierto, invitación de pasarela) que soporte `previewEnvelope` en el editor.
2. **Barra superior de progreso (`scaleX`) + Navegación flotante tipo píldora (`backdrop-filter: blur`).**
3. **Hero Sticky en dos tiempos (`190–195svh`, `data-editor-section="hero"`):**
   - Estado 1: Copy editorial + chips de fecha/sede + motivo vectorial + imagen enmarcada (arco, escotilla, vinilo, ventana).
   - Durante la transición, el copy se retira, el motivo protagonista se desplaza, el marco se expande a pantalla completa y emerge una tarjeta puente hacia la historia. Ajusta el `scrub` al recorrido del hero.
4. **Banda cinética (`Marquee`):** Cinta horizontal continua con `mask-image` lateral que aporta ritmo entre capítulos.
5. **Manifiesto / Historia (`data-editor-section="quoteStory"`).** Ilumina las palabras de la cita y dibuja el SVG (`strokeDashoffset`) en la línea de tiempo de `createQuoteReveal`, disparada por el `blockquote`. Completa ambos efectos cuando la última línea entre en pantalla. Da a las 3 tarjetas de historia su propio gesto suave ligado a la temática.
6. **Inmersión temática (4 estaciones o momentos destacados).** Crea 4 tarjetas ilustradas y un fondo propio. Usa una cuadrícula Bento en escritorio. Si apilas tarjetas `sticky` en móvil, usa un marcador independiente por tarjeta y muestra el estado inicial de cada revelación antes de animarla.
7. **Familia / Círculo de Honor (`data-editor-section="vipParents"`).** Centra las tarjetas y anima con moderación el desplazamiento, la escala o sus detalles decorativos.
8. **Cuenta regresiva (`data-editor-section="countdown"`).** Mantén números y etiquetas fijos y legibles. Si animas arcos, trazos o cambios de opacidad, vincúlalos al scroll y separa la animación del reloj. Incluye las acciones de calendario solicitadas y centra el botón si hay uno solo.
9. **Ubicaciones + Mapa Interactivo (`data-editor-section="locations"`):** Fotografía con apertura de `clip-path`, iframe de Google Maps y 4 botones de ruta (Google Maps, Waze, Apple Maps, Uber).
10. **Itinerario con Riel Progresivo y Viajero (`data-editor-section="timeline"`):** Línea vertical que crece con `scaleY` acompañada de un icono/vehículo temático que recorre la trayectoria al hacer scroll.
11. **Galería, vestimenta, regalos, álbum social y RSVP con QR.** Elige un gesto suave para cada escena. Mantén las instrucciones de carga del álbum como texto secundario y deja fijos los formularios y controles.

### 4. Ritmo y verificación del scroll
- Usa gestos distintos para fotos, texto, adornos y tarjetas. Da prioridad a desplazamientos cortos, cambios moderados de opacidad y revelaciones de detalles. Ajusta la curva y el tramo de scroll por escena.
- Cuando una escena use un telón, prueba el estado cerrado, la apertura parcial y el estado abierto de cada tarjeta. Comprueba que cada foto termine de revelarse antes de que la siguiente la cubra.
- Prueba el avance y el retroceso en móvil y escritorio. En móvil, revisa también un salto por enlace interno y un cambio de tamaño a mitad de una escena `sticky`.

### 5. Contrato con el Editor y Accesibilidad
- Conecta todos los textos y medios a `InvitationConfig` y usa un helper de migración suave para actualizar solo valores semilla antiguos sin sobrescribir ediciones del usuario.
- Registra las clases `.xx-*` en `src/lib/editor/section-targets.ts` y añade `data-editor-section` en cada sección.
- Soporta `scroller = root.closest('[data-invitation-scroller]') || undefined` en todos los `ScrollTrigger`.
- Respeta `prefers-reduced-motion` en CSS y en las animaciones JS. Deja las fotos y los textos visibles en ese modo.
- Verifica con `npm run typecheck`, `npm run build` y pruebas reales en navegador a `320×640`, `390×844` y `1280×800`.
```

---

## 7. Lista de verificación antes de dar por terminado un template

- [ ] **Cero gráficos deformes:** Todos los vectores SVG tienen proporciones armónicas, ejes de simetría verificados y capas de profundidad.
- [ ] **Centrado móvil perfecto:** En `390×844`, ningún bloque de texto, imagen de portada, tarjeta única o botón queda cargado hacia un lado.
- [ ] **Cero desbordamiento horizontal:** `document.documentElement.scrollWidth <= window.innerWidth` tanto en móvil como en escritorio.
- [ ] **Riqueza narrativa:** Al menos 10–12 secciones/capítulos visuales (incluyendo marquesinas cinéticas y sección de experiencia temática).
- [ ] **Fondos escénicos completos:** Ninguna sección depende solo de un color plano; los motivos temáticos cambian de posición, escala y animación entre capítulos, incluida la inmersión temática, sin obstaculizar el contenido.
- [ ] **Scroll reversible (`scrub`):** El hero, el manifiesto por palabras, el dibujo SVG, el riel del itinerario y las tarjetas responden suavemente al subir y bajar.
- [ ] **Revelaciones por tarjeta.** Si hay telones, comprueba en móvil el estado cerrado, la apertura parcial y la foto completa en cada estación. El efecto sigue funcionando al cambiar el tamaño con una tarjeta fijada.
- [ ] **Cuenta regresiva legible.** Los números y las etiquetas permanecen fijos, los arcos avanzan sin saltos y las acciones de calendario quedan centradas.
- [ ] **Movimiento reducido.** Los textos y las fotos se pueden consultar sin activar animaciones de scroll.
- [ ] **Compatibilidad total con el editor:** Funciona en vivo con selección de secciones, vista previa del sobre (`previewEnvelope`), cambio de colores/fuentes y generación de pase QR.
