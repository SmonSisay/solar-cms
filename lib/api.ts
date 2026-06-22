import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { hasPermission, type Permission, type UserRole } from '@/lib/permissions';
import { normalizeError } from './errors';

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(error: any, status?: number) {
  const normalized = normalizeError(error);
  const finalStatus = status ?? normalized.statusCode;
  return NextResponse.json(
    {
      success: false,
      error: normalized.message,
      errorDetails: {
        code: normalized.code,
        message: normalized.message,
        details: normalized.details,
      },
    },
    { status: finalStatus }
  );
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || !role || !allowedRoles.includes(role)) {
    return null;
  }
  return session;
}

/**
 * Permission-based access control.
 * Uses the static RBAC matrix from lib/permissions.ts.
 */
export async function requirePermission(permission: Permission) {
  const session = await auth();
  const role = session?.user?.role as UserRole | undefined;
  if (!session?.user || !role || !hasPermission(role, permission)) {
    return null;
  }
  return session;
}

// ── Convenience helpers (backward-compatible) ───────────────────────────────

export async function requireSuperAdmin() {
  return requireRole(['super_admin']);
}

export async function requireAdmin() {
  return requireRole(['super_admin', 'admin']);
}

export async function requireEditorOrAbove() {
  return requireRole(['super_admin', 'admin', 'editor']);
}

export async function requireContentManagerOrAbove() {
  return requireRole(['super_admin', 'admin', 'editor', 'content_manager']);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}
