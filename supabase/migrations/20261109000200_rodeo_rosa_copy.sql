-- Refresh the original Rodeo Rosa copy in saved invitations.
UPDATE public.events
SET config = jsonb_set(config, '{content,quoteStory,quoteText}',
  to_jsonb('Me hace ilusión celebrar mi cumpleaños contigo. Habrá fotos con sombrero, juegos de rancho y pastel para compartir con mi gente favorita.'::text))
WHERE template_id = 'rodeo-rosa'
  AND config #>> '{content,quoteStory,quoteText}' = 'Me hace ilusión celebrar mi cumpleaños contigo. Habrá fotos con sombrero, juegos de rancho y una rebanada de pastel para cada persona de mi pandilla.';

UPDATE public.events
SET config = jsonb_set(config, '{content,sectionHeadings,vip_parents,eyebrow}', '"03 / En buena compañía"')
WHERE template_id = 'rodeo-rosa'
  AND config #>> '{content,sectionHeadings,vip_parents,eyebrow}' = '03 / La pandilla';

UPDATE public.events
SET config = jsonb_set(config, '{content,sectionHeadings,social_features,title}', '"Álbum del rodeo"')
WHERE template_id = 'rodeo-rosa'
  AND config #>> '{content,sectionHeadings,social_features,title}' = 'Álbum de la pandilla';

UPDATE public.events
SET config = jsonb_set(config, '{content,vipParents,groups}', (
  SELECT jsonb_agg(
    CASE WHEN entry.item ->> 'groupTitle' = 'Nuestra pandilla'
      THEN jsonb_set(entry.item, '{groupTitle}', '"Nuestros invitados"')
      ELSE entry.item
    END ORDER BY entry.position
  )
  FROM jsonb_array_elements(config #> '{content,vipParents,groups}') WITH ORDINALITY AS entry(item, position)
))
WHERE template_id = 'rodeo-rosa'
  AND (config #> '{content,vipParents,groups}') @> '[{"groupTitle":"Nuestra pandilla"}]';
