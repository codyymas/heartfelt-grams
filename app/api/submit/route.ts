import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const recipientName = formData.get('recipientName') as string;
    const message = formData.get('message') as string;
    const files = formData.getAll('files') as File[];

    const attachments = await Promise.all(
      files
        .filter((f) => f.size > 0)
        .map(async (file) => {
          const buffer = await file.arrayBuffer();
          return {
            filename: file.name,
            content: Buffer.from(buffer),
          };
        })
    );

    const result = await resend.emails.send({
      from: 'Heartfelt Grams <orders@heartfeltcraftsco.com>',
      to: process.env.RECIPIENT_EMAIL!,
      replyTo: email,
      subject: `New Order from ${name}`,
      html: `
        <h2 style="color:#b91c1c;">New Order from ${name}</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Recipient:</strong> ${recipientName}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;background:#fef2f2;padding:12px;border-radius:6px;">${message}</p>
        <p style="color:#9ca3af;font-size:12px;">${attachments.length} file(s) attached</p>
      `,
      attachments,
    });

    console.log('Resend result:', JSON.stringify(result));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
