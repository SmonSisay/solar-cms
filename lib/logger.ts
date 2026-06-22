import { connectDB } from './mongodb';
import { ActivityLog } from './models';
import type { Permission } from './permissions';

interface LogOptions {
  userId: string;
  userName: string;
  userEmail: string;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'restore' | 'publish' | 'settings_change';
  module: string;
  targetId?: string;
  targetName?: string;
  details?: string;
  ipAddress?: string;
}

export async function logActivity(options: LogOptions) {
  try {
    await connectDB();
    await ActivityLog.create({
      userId: options.userId,
      userName: options.userName,
      userEmail: options.userEmail,
      action: options.action,
      module: options.module,
      targetId: options.targetId ?? '',
      targetName: options.targetName ?? '',
      details: options.details ?? '',
      ipAddress: options.ipAddress ?? '',
    });
  } catch (error) {
    console.error('Failed to log admin activity:', error);
  }
}
