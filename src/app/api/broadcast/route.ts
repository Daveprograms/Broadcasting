import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendUrgentStopBroadcastEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string })?.role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { emailToStop } = await req.json();

    if (!emailToStop) {
      return NextResponse.json(
        { error: "Must specify an email node address to halt" },
        { status: 400 }
      );
    }

    // Retrieve all users in the system to target
    const users = await prisma.user.findMany({
      select: {
        email: true,
      },
    });

    if (users.length === 0) {
      return NextResponse.json({ message: "No registered users to notify" });
    }

    // Trigger urgent message sends 5 times in a loop with small delay
    // Note: We run this asynchronously so we can return response immediately, or execute sequentially.
    // Sequentially executing is safer to guarantee all sends finish, but we don't want Next.js to timeout,
    // so we can execute it as a non-blocking background task.
    (async () => {
      try {
        console.log(`[Urgent Broadcast Blast Started] Email to stop: ${emailToStop}. Sending 5 waves to ${users.length} users...`);
        for (let wave = 1; wave <= 5; wave++) {
          console.log(`[Broadcast Wave ${wave}/5] Transmitting alerts...`);
          for (const user of users) {
            try {
              await sendUrgentStopBroadcastEmail(user.email, emailToStop);
            } catch (err) {
              console.error(`Failed to send alert wave ${wave} to ${user.email}:`, err);
            }
          }
          if (wave < 5) {
            // Small delay between waves (e.g. 1 second)
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
        console.log(`[Urgent Broadcast Blast Finished] 5 waves sent successfully.`);
      } catch (blastErr) {
        console.error("Critical error in broadcast alert blast loop:", blastErr);
      }
    })();

    return NextResponse.json({
      message: `Urgent stop broadcast blast initiated successfully. 5 alert waves are being transmitted to all ${users.length} users in the background.`,
      recipientCount: users.length,
    });
  } catch (error) {
    console.error("Stop broadcast API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
