import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string })?.role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email1, email1Name, email2, email2Name } = await req.json();

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {
        email1,
        email1Name: email1Name || "",
        email2,
        email2Name: email2Name || "",
      },
      create: {
        id: 1,
        email1,
        email1Name: email1Name || "",
        email2,
        email2Name: email2Name || "",
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
