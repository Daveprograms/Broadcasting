import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ClientAdmin from "./ClientAdmin";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user as { role?: string })?.role;
  if (userRole !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch settings
  let settings = await prisma.settings.findUnique({
    where: { id: 1 },
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: 1,
        email1: "etransfer-alpha@broadcasting.net",
        email1Name: "James",
        email2: "etransfer-beta@broadcasting.net",
        email2Name: "Sarah",
      },
    });
  }

  // Fetch support tickets
  const tickets = await prisma.supportTicket.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  // Fetch payment verifications
  const verifications = await prisma.paymentVerification.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  // Convert dates to ISO strings for client compatibility
  const serializedTickets = tickets.map((ticket) => ({
    ...ticket,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  }));

  const serializedVerifications = verifications.map((v) => ({
    ...v,
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
  }));

  return (
    <ClientAdmin
      initialSettings={settings}
      initialTickets={serializedTickets}
      initialVerifications={serializedVerifications}
    />
  );
}
