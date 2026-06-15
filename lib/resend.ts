import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<void> {
  const to = process.env.ADMIN_EMAIL_TO ?? process.env.ADMIN_EMAIL;
  if (!to || !process.env.RESEND_API_KEY) {
    console.warn('Resend not configured — skipping email');
    return;
  }

  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const phone = escapeHtml(data.phone ?? 'N/A');
  const subject = escapeHtml(data.subject);
  const message = escapeHtml(data.message).replace(/\n/g, '<br>');

  await resend.emails.send({
    from: 'Smon Solar <onboarding@resend.dev>',
    to,
    replyTo: data.email,
    subject: `[Contact] ${data.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });
}

export async function sendLeadEmail(data: {
  name: string;
  email: string;
  phone: string;
  message?: string;
  productRef?: string;
  source: string;
}): Promise<void> {
  const to = process.env.ADMIN_EMAIL_TO ?? process.env.ADMIN_EMAIL;
  if (!to || !process.env.RESEND_API_KEY) {
    console.warn('Resend not configured — skipping email');
    return;
  }

  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const phone = escapeHtml(data.phone);
  const source = escapeHtml(data.source);
  const productRef = escapeHtml(data.productRef ?? 'General inquiry');
  const message = escapeHtml(data.message ?? '').replace(/\n/g, '<br>');

  await resend.emails.send({
    from: 'Smon Solar <onboarding@resend.dev>',
    to,
    replyTo: data.email,
    subject: `[Quote Lead] ${data.name}`,
    html: `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Source:</strong> ${source}</p>
      <p><strong>Product:</strong> ${productRef}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });
}

