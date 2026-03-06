import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const recipientName = formData.get('recipientName') as string;
    const memory = formData.get('memory') as string;
    const compliment1 = formData.get('compliment1') as string;
    const compliment2 = formData.get('compliment2') as string;
    const compliment3 = formData.get('compliment3') as string;
    const message = formData.get('message') as string;
    const fileUrls = formData.getAll('fileUrls') as string[];

    const fileLinksHtml = fileUrls.length > 0
      ? fileUrls.map((url, i) => `<a href="${url}" style="display:block;color:#b91c1c;margin-bottom:6px;">📎 Download File ${i + 1}</a>`).join('')
      : '<p style="color:#9ca3af;">No files uploaded</p>';

    await resend.emails.send({
      from: 'Heartfelt Grams <onboarding@resend.dev>',
      to: 'contact@heartfeltcraftsco.com',
      replyTo: email,
      subject: `New Order from ${name}`,
      html: `
        <h2 style="color:#b91c1c;">New Order from ${name}</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Recipient:</strong> ${recipientName}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;background:#fef2f2;padding:12px;border-radius:6px;">${message || '(none)'}</p>
        <p><strong>Favorite Memory:</strong></p>
        <p style="white-space:pre-wrap;background:#fef2f2;padding:12px;border-radius:6px;">${memory || '(none)'}</p>
        <p><strong>3 Compliments:</strong></p>
        <ol style="padding-left:20px;">
          <li>${compliment1 || '(none)'}</li>
          <li>${compliment2 || '(none)'}</li>
          <li>${compliment3 || '(none)'}</li>
        </ol>
        <p><strong>Uploaded Files:</strong></p>
        ${fileLinksHtml}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
