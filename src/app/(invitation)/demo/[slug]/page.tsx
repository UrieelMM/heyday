import { notFound } from 'next/navigation';
import { TEMPLATES_CATALOG } from '@/lib/templates/templates-catalog';
import PublicInvitationPage, {
  generateMetadata as generateInvitationMetadata,
} from '../../invitacion/[slug]/page';

type DemoPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ g?: string; template?: string }>;
};

async function assertDemoSlug(params: DemoPageProps['params']) {
  const { slug } = await params;
  if (!TEMPLATES_CATALOG.some((template) => template.id === slug)) notFound();
  return slug;
}

function withDemoTemplate(props: DemoPageProps, slug: string): DemoPageProps {
  return {
    ...props,
    searchParams: props.searchParams.then((params) => ({ ...params, template: slug })),
  };
}

export async function generateMetadata(props: DemoPageProps) {
  const slug = await assertDemoSlug(props.params);
  return generateInvitationMetadata(withDemoTemplate(props, slug));
}

export default async function DemoPage(props: DemoPageProps) {
  const slug = await assertDemoSlug(props.params);
  return PublicInvitationPage(withDemoTemplate(props, slug));
}
