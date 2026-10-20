import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TeamProfilePage } from "@/components/site/team-profile-page";
import { teamDisciplines } from "@/content/content";

type TeamProfileRouteProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return teamDisciplines.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: TeamProfileRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const member = teamDisciplines.find((profile) => profile.slug === slug);
  if (!member) return {};

  const title = `${member.name} | ${member.role}`;
  const description = member.bio;

  return {
    title,
    description,
    alternates: { canonical: `/team/${member.slug}` },
    openGraph: {
      title,
      description,
      images: member.portrait
        ? [{ url: member.portrait, alt: `${member.name}, ${member.role}` }]
        : [],
    },
  };
}

export default async function TeamProfileRoute({
  params,
}: TeamProfileRouteProps) {
  const { slug } = await params;
  const member = teamDisciplines.find((profile) => profile.slug === slug);
  if (!member) notFound();

  const relatedMembers = teamDisciplines.filter(
    (profile) => profile.slug !== member.slug,
  );

  return <TeamProfilePage member={member} relatedMembers={relatedMembers} />;
}
