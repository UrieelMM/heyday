# Dirección de escenas: tres celebraciones

Aplicación de `SCROLL_SCENES.md` a Golden Jubilee, Fiesta Kids Adventure y Celestial Grace. Cada portada abre con un estado legible, transforma su imagen con el progreso del scroll y cierra con una frase puente. Historia, cuenta regresiva, lugar, programa y galería tienen movimientos reversibles; formularios y botones permanecen estables.

| Template | Evento y referencia | Lenguaje visual | Gesto de portada | Ritmo posterior |
| --- | --- | --- | --- | --- |
| Golden Jubilee | Cumpleaños adulto de gala. El [V&A](https://www.vam.ac.uk/collections/art-deco) describe el Art Déco mediante geometría, modernidad y lujo. | Ónix, oro champagne, líneas simétricas, marco de gala y Cinzel con Inter. | El marco geométrico cede espacio a una sala de celebración que llena la pantalla. | Cita monumental, tarjetas sobrias, números dorados, cronología vertical y dos fotografías editoriales. |
| Fiesta Kids Adventure | Cumpleaños infantil. [UNICEF](https://www.unicef.org/digitaleducation/stories/calling-play-increasingly-digital-world) destaca que el juego impulsa la imaginación y la creatividad. | Papel recortado, sol, estrellas, camino, bloques redondeados y Fredoka con Plus Jakarta Sans. | La ilustración se abre como un mapa de aventura; los adornos se separan con el scroll. | Cita lúdica, tarjetas bento, contador de colores, hitos de juego y galería ilustrada. |
| Celestial Grace | Bautizo o Primera Comunión. El [National Liturgical Council](https://nlc.catholic.org.au/blog-posts/symbols-of-baptism) identifica agua, vestidura blanca y luz en el bautizo; el [Catecismo](https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_3/in_brief.html) señala el pan y el vino como signos de la Eucaristía. | Marfil, azul cielo, oro suave, rama de olivo, Cormorant y Plus Jakarta Sans. | Una ventana circular muestra la pila bautismal o el cáliz, según el evento, y se abre hacia la ceremonia. | Cita serena, protagonismo de la familia, recorrido de ceremonia y detalles de vela y lino. |

Las siete imágenes de portada y galería se generaron para estos conceptos y se guardan en `public/images/`. Son imágenes conceptuales de la invitación; las portadas que personalice el usuario permanecen configurables.

## Comprobaciones de experiencia

- El contenido se adapta al tipo de celebración: nombres, frases, programa y vestimenta de muestra no reutilizan el contenido de boda.
- Cada escena de scroll se registra solo cuando existe su sección y se limpia con el ciclo de `useGSAP`.
- Con movimiento reducido, la portada pasa a una pantalla estática y las palabras permanecen visibles.
- RSVP y sugerencias musicales de estas vistas siguen indicando que son una demostración local.
