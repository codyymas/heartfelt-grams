import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, recipientName, message } = await request.json();

    await resend.emails.send({
      from: 'Heartfelt Grams <onboarding@resend.dev>',
      to: process.env.RECIPIENT_EMAIL!,
      replyTo: email,
      subject: `✅ Payment Confirmed — Order from ${name}`,
      html: `
        <h2 style="color:#16a34a;">✅ Payment Confirmed — Order from ${name}</h2>
        <p style="background:#f0fdf4;padding:10px;border-radius:6px;display:inline-block;">
          <strong>Payment Status: ✅ Paid</strong>
        </p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Recipient:</strong> ${recipientName}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;background:#f0fdf4;padding:12px;border-radius:6px;">${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Confirm email error:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
