import { apiSuccess, apiError, getClientIp } from '@/lib/api';
import { contactSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendContactEmail } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed } = await checkRateLimit(`contact:${ip}`, 5);

    if (!allowed) {
      return apiError('Too many requests. Please try again later.', 429);
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');
    }

    try {
      await sendContactEmail(parsed.data);
    } catch (emailError) {
      console.error('Contact email failed:', emailError);
      return apiError('Failed to send message. Please try again.', 500);
    }

    return apiSuccess({ sent: true });
  } catch (error) {
    console.error('POST /api/contact:', error);
    return apiError('Failed to send message', 500);
  }
}
