import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bookingSchema = z.object({
  eventType: z.string().min(1),
  date: z.string().optional(),
  budgetTier: z.string().optional(),
  message: z.string().min(10).max(5000),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Validate Content-Type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    const body = await request.json();

    // Honeypot check — bots fill this field
    if (body.website_url) {
      return NextResponse.json({ success: true });
    }

    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid booking request", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Integration point: send booking notification email
    // Replace the line below with your email service (Resend, Formspree, etc.)
    // Example with Resend:
    //   await resend.emails.send({ to: "missbelle@example.com", subject: `New booking: ${data.eventType}`, ... })
    void data;

    return NextResponse.json({ success: true, message: "Booking request received" });
  } catch {
    return NextResponse.json(
      { error: "Failed to process booking request" },
      { status: 500 }
    );
  }
}