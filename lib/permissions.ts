/**
 * Static permission matrix for the RBAC system.
 *
 * Design decision: Static map in code rather than DB-driven.
 * - 4 roles is a small, stable set → no need for DB overhead.
 * - Permissions are enforced at API layer via `requirePermission()`.
 * - AdminShell uses `hasPermission()` for nav visibility.
 */

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'content_manager';

export type Permission =
  | 'manage_users'
  | 'manage_roles'
  | 'manage_settings'
  | 'manage_products'
  | 'manage_leads'
  | 'manage_services'
  | 'manage_blog'
  | 'manage_pages'
  | 'manage_faq'
  | 'manage_testimonials'
  | 'manage_team'
  | 'manage_seo'
  | 'manage_media'
  | 'manage_menus'
  | 'manage_redirects'
  | 'view_activity_logs'
  | 'publish_content'
  | 'delete_content';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'manage_users',
    'manage_roles',
    'manage_settings',
    'manage_products',
    'manage_leads',
    'manage_services',
    'manage_blog',
    'manage_pages',
    'manage_faq',
    'manage_testimonials',
    'manage_team',
    'manage_seo',
    'manage_media',
    'manage_menus',
    'manage_redirects',
    'view_activity_logs',
    'publish_content',
    'delete_content',
  ],
  admin: [
    'manage_products',
    'manage_leads',
    'manage_services',
    'manage_blog',
    'manage_pages',
    'manage_faq',
    'manage_testimonials',
    'manage_team',
    'manage_seo',
    'manage_media',
    'manage_menus',
    'manage_redirects',
    'publish_content',
    'delete_content',
  ],
  editor: [
    'manage_blog',
    'manage_pages',
    'manage_faq',
    'manage_media',
    'publish_content',
  ],
  content_manager: [
    'manage_blog',
    'manage_pages',
    'manage_faq',
    'manage_seo',
    'manage_media',
  ],
};

/**
 * Check if a given role has a specific permission.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Check if a given role has ALL of the specified permissions.
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a given role has ANY of the specified permissions.
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Get all permissions for a given role.
 */
export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
