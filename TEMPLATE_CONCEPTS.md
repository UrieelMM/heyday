# Dirección de arte de los tres templates

Estos templates siguen el sistema de escenas de `SCROLL_SCENES.md`: una portada sticky de dos tiempos, una transformación protagonista por capítulo y movimiento reversible ligado al scroll. Los controles y el contenido importante permanecen operativos sin terminar la animación.

| Template | Evento y concepto | Tipografía | Motivos y coreografía |
| --- | --- | --- | --- |
| Boho Terracotta | Boda de jardín o destino; íntima, natural y cálida | Playfair Display + Plus Jakarta Sans | Sol de papel, botánicos dibujados, marco orgánico, galería tipo fotografía impresa; la foto se abre desde una forma arqueada |
| Modern Minimal Noir | Boda civil contemporánea; una edición monocroma | Cormorant Garamond + Inter | Retícula, filetes editoriales, numeración y fotografía en blanco y negro; la portada se convierte en página completa |
| Neon XV Euphoria | XV años nocturnos; una fiesta juvenil con energía de club | Syne + Space Grotesk | Órbitas luminosas, luces magenta/cian y pase VIP; el ticket sale mientras la pista ocupa la pantalla |

## Referencias conceptuales

- [Paperlust, bodas terracota](https://paperlust.co/blog/terracotta-wedding/): materiales naturales, terracota, flores secas y luz cálida para orientar Boho.
- [Paperlust, bodas blanco y negro](https://paperlust.co/blog/black-and-white-wedding/): paleta monocroma y papelería con contraste tipográfico para Noir.
- [EventDay, invitación Glow de 15 años](https://eventday.ar/cumple/invitacion-glow/): luces y ambiente de fiesta como punto de partida para Neon XV.

## Imágenes generadas para las portadas

Se usó la herramienta integrada ImageGen y se guardaron versiones JPEG optimizadas en `public/images/`.

- `boho-terracotta/sunset-garden.jpg`: fotografía editorial de una mesa de boda en jardín mexicano al atardecer, flores asimétricas, pampas, cerámica terracota y lino marfil; sin personas, globos ni texto.
- `modern-minimal-noir/civil-architecture.jpg`: fotografía editorial monocroma de ceremonia civil con arquitectura de concreto, pasillo y flores blancas; sin personas ni texto.
- `neon-xv-euphoria/night-stage.jpg`: fotografía nocturna de pista y escenario de XV años con arcos LED magenta/cian y reflejos de bola disco; sin personas ni texto.

El contenido editable del builder conserva la prioridad: cada imagen local es sólo el valor inicial de su template.
