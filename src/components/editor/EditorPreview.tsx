'use client';

import { useEffect, useRef, useState } from 'react';
import { InvitationRenderer } from '@/components/invitation/core/InvitationRenderer';
import { editorTargetForElement, editorTargetForSection } from '@/lib/editor/section-targets';
import type { InvitationConfig, TemplateId } from '@/types/invitation.types';
import './preview-interactions.css';

type PreviewMessage =
  | { type: 'heyday:preview'; config: InvitationConfig; eventDate: string; templateId: TemplateId; previewEnvelope: boolean }
  | { type: 'heyday:focus-section'; section: string }
  | { type: 'heyday:pick-mode'; enabled: boolean };

export function EditorPreview({ slug, templateId, eventDate, initialConfig }: { slug: string; templateId: TemplateId; eventDate: string; initialConfig: InvitationConfig }) {
  const [preview, setPreview] = useState({ config: initialConfig, eventDate, templateId, previewEnvelope: false });
  const [pickMode, setPickMode] = useState(false);
  const hovered = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const receive = (event: MessageEvent<PreviewMessage>) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === 'heyday:preview') setPreview({ config: event.data.config, eventDate: event.data.eventDate, templateId: event.data.templateId, previewEnvelope: event.data.previewEnvelope });
      if (event.data?.type === 'heyday:pick-mode') setPickMode(event.data.enabled);
      if (event.data?.type === 'heyday:focus-section') {
        const section = event.data.section;
        requestAnimationFrame(() => {
          if (section === 'envelope') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
          editorTargetForSection(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    };
    window.addEventListener('message', receive);
    window.parent.postMessage({ type: 'heyday:preview-ready' }, window.location.origin);
    return () => window.removeEventListener('message', receive);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('editor-preview-pick-mode', pickMode);
    const clearHover = () => { hovered.current?.classList.remove('editor-preview-hover'); hovered.current = null; };
    if (!pickMode) { clearHover(); return () => document.documentElement.classList.remove('editor-preview-pick-mode'); }
    const onPointerMove = (event: PointerEvent) => {
      const match = event.target instanceof Element ? editorTargetForElement(event.target) : null;
      if (hovered.current === match?.target) return;
      clearHover();
      if (match) { match.target.classList.add('editor-preview-hover'); hovered.current = match.target; }
    };
    const onClick = (event: MouseEvent) => {
      const match = event.target instanceof Element ? editorTargetForElement(event.target) : null;
      if (!match) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.parent.postMessage({ type: 'heyday:select-section', section: match.section }, window.location.origin);
      setPickMode(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setPickMode(false);
      window.parent.postMessage({ type: 'heyday:pick-cancel' }, window.location.origin);
    };
    document.addEventListener('pointermove', onPointerMove, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.documentElement.classList.remove('editor-preview-pick-mode');
      document.removeEventListener('pointermove', onPointerMove, true);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onKeyDown, true);
      clearHover();
    };
  }, [pickMode]);
  return <InvitationRenderer slug={slug} templateId={preview.templateId} eventDate={preview.eventDate} config={preview.config} previewEnvelope={preview.previewEnvelope} isBuilderPreview />;
}
