import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email(),
  consent: z.boolean().refine((val) => val, {
    message: "Consent is required",
  }),
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

    // Honeypot check
    if (body.website_url) {
      return NextResponse.json({ success: true });
    }

    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid newsletter subscription", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Integration point: subscribe email to newsletter service
    // Replace the line below with your newsletter service (Buttondown, Resend, etc.)
    // Example with Buttondown:
    //   await fetch("https://api.buttondown.email/v1/subscribers", { method: "POST", headers: { Authorization: `Token ${TOKEN}` }, body: JSON.stringify({ email: data.email }) })
    void data;

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}