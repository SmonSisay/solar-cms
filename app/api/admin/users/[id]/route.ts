import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';
import { apiSuccess, apiError, requireSuperAdmin } from '@/lib/api';
import { userSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSuperAdmin();
    if (!session) return apiError('Forbidden', 403);

    const body = await request.json();
    const parsed = userSchema.partial().safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');
    }

    const { name, email, password, role, active } = parsed.data;
    const currentUserId = (session.user as any).id;

    // Self-lockout check
    if (params.id === currentUserId) {
      if (active === false) {
        return apiError('You cannot deactivate your own account');
      }
      if (role && role !== 'super_admin') {
        return apiError('You cannot change your own role');
      }
    }

    await connectDB();

    const targetUser = await User.findOne({ _id: params.id, deletedAt: null });
    if (!targetUser) {
      return apiError('User not found', 404);
    }

    // Email duplication check
    if (email && email.toLowerCase() !== targetUser.email) {
      const existing = await User.findOne({
        email: email.toLowerCase(),
        deletedAt: null,
      });
      if (existing) {
        return apiError('User with this email already exists', 409);
      }
      targetUser.email = email.toLowerCase();
    }

    if (name) targetUser.name = name;
    if (role) targetUser.role = role;
    if (active !== undefined) targetUser.active = active;

    if (password) {
      targetUser.passwordHash = await bcrypt.hash(password, 12);
    }

    await targetUser.save();

    const userObj = targetUser.toObject();
    delete (userObj as any).passwordHash;

    return apiSuccess(userObj);
  } catch (error) {
    console.error('PUT /api/admin/users/[id]:', error);
    return apiError('Failed to update user', 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSuperAdmin();
    if (!session) return apiError('Forbidden', 403);

    const currentUserId = (session.user as any).id;

    // Self-lockout check
    if (params.id === currentUserId) {
      return apiError('You cannot delete your own account');
    }

    await connectDB();

    const targetUser = await User.findOne({ _id: params.id, deletedAt: null });
    if (!targetUser) {
      return apiError('User not found', 404);
    }

    // Soft delete
    targetUser.deletedAt = new Date();
    targetUser.deletedBy = currentUserId;
    await targetUser.save();

    return apiSuccess({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/admin/users/[id]:', error);
    return apiError('Failed to delete user', 500);
  }
}
