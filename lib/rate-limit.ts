import { connectDB } from '@/lib/mongodb';
import RateLimit from '@/lib/models/RateLimit';

const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function checkRateLimit(
  key: string,
  maxRequests: number
): Promise<{ allowed: boolean; remaining: number }> {
  await connectDB();

  const now = new Date();
  const record = await RateLimit.findOne({ key });

  if (!record) {
    await RateLimit.create({ key, count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  const windowExpired = now.getTime() - record.windowStart.getTime() > WINDOW_MS;

  if (windowExpired) {
    record.count = 1;
    record.windowStart = now;
    await record.save();
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  await record.save();
  return { allowed: true, remaining: maxRequests - record.count };
}
