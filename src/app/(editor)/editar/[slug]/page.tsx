import { EditorClient } from '@/components/editor/EditorClient';

export default async function EditInvitationPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { slug } = await params;
  const { tab } = await searchParams;
  return <EditorClient slug={slug} initialTab={tab === 'guests' ? 'guests' : 'appearance'} />;
}
