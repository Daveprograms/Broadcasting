import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail, sendTermsEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, password, agreedToTerms } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!agreedToTerms) {
      return NextResponse.json(
        { error: "You must read and agree to the Terms and Conditions to signup." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // If matches admin email env, set role to ADMIN
    const isAdminEmail = email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
    const role = isAdminEmail ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
      },
    });

    // Send Welcome Email + Terms and Conditions Email
    try {
      await sendWelcomeEmail(user.email, user.name || "User");
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
    }

    try {
      await sendTermsEmail(user.email, user.name || "User");
    } catch (emailErr) {
      console.error("Failed to send terms email:", emailErr);
    }

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
