import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';
import { apiSuccess, apiError, requireSuperAdmin } from '@/lib/api';
import { userSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await requireSuperAdmin();
    if (!session) return apiError('Forbidden', 403);

    await connectDB();
    const users = await User.find({ deletedAt: null })
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();
    return apiSuccess(users);
  } catch (error) {
    console.error('GET /api/admin/users:', error);
    return apiError('Failed to fetch users', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSuperAdmin();
    if (!session) return apiError('Forbidden', 403);

    const body = await request.json();
    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');
    }

    const { name, email, password, role, active } = parsed.data;

    if (!password) {
      return apiError('Password is required for new users');
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase(), deletedAt: null });
    if (existing) {
      return apiError('User with this email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      active,
    });

    const userObj = user.toObject();
    delete (userObj as any).passwordHash;

    return apiSuccess(userObj, 201);
  } catch (error) {
    console.error('POST /api/admin/users:', error);
    return apiError('Failed to create user', 500);
  }
}
