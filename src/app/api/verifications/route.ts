import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    const userRole = (session.user as { role?: string })?.role;

    if (!userId) {
      return NextResponse.json({ error: "Invalid user session" }, { status: 401 });
    }

    if (userRole === "ADMIN") {
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
      return NextResponse.json(verifications);
    } else {
      const verifications = await prisma.paymentVerification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(verifications);
    }
  } catch (error) {
    console.error("Get verifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid user session" }, { status: 401 });
    }

    const { senderName, amount, phoneNumber, notes, screenshot } = await req.json();

    if (!senderName || amount === undefined || !phoneNumber || !screenshot) {
      return NextResponse.json(
        { error: "Missing required verification fields (screenshot, senderName, amount, phoneNumber)" },
        { status: 400 }
      );
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    const verification = await prisma.paymentVerification.create({
      data: {
        userId,
        senderName,
        amount: parsedAmount,
        phoneNumber,
        notes: notes || "",
        screenshot,
        status: "PENDING",
      },
    });

    return NextResponse.json(verification);
  } catch (error) {
    console.error("Submit verification error:", error);
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

    const { verificationId, status, adminNote } = await req.json();

    if (!verificationId || !status) {
      return NextResponse.json(
        { error: "Verification ID and status are required" },
        { status: 400 }
      );
    }

    if (!["PENDING", "VERIFIED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedVerification = await prisma.paymentVerification.update({
      where: { id: verificationId },
      data: {
        status,
        adminNote: adminNote || "",
      },
    });

    return NextResponse.json(updatedVerification);
  } catch (error) {
    console.error("Update verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
