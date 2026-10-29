import type { InvitationConfig, SectionId } from '@/types/invitation.types';

export function sectionHeading(config: InvitationConfig, section: SectionId, part: 'eyebrow' | 'title', fallback: string) {
  return config.content.sectionHeadings?.[section]?.[part] || fallback;
}
