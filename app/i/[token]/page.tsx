import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InvitationClient from "./InvitationClient";

export const dynamic = "force-dynamic";

export default async function InvitationPage({
  params,
}: {
  params: { token: string };
}) {
  const guest = await prisma.guest.findUnique({
    where: { token: params.token },
  });

  if (!guest) {
    notFound();
  }

  if (!guest.viewedAt) {
    prisma.guest
      .update({ where: { id: guest.id }, data: { viewedAt: new Date() } })
      .catch(() => {});
  }

  return <InvitationClient name={guest.name} />;
}
