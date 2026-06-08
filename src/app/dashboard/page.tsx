import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ClientDashboard from "./ClientDashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch or initialize e-transfer settings
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

  return (
    <ClientDashboard
      initialEmail1={settings.email1}
      initialEmail1Name={settings.email1Name}
      initialEmail2={settings.email2}
      initialEmail2Name={settings.email2Name}
    />
  );
}
