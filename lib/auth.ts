import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import { checkRateLimit } from './rate-limit';
import { connectDB } from './mongodb';
import { User } from './models';
import { authConfig } from './auth.config';
import { logActivity } from './logger';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        // Rate limiting check
        try {
          const headerList = headers();
          const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
          const { allowed } = await checkRateLimit(`login:${ip}`, 5);
          if (!allowed) {
            throw new Error('Too many login attempts. Please try again in an hour.');
          }
        } catch (err: any) {
          if (err.message?.includes('Too many login attempts')) {
            throw err;
          }
          console.error('Rate limiting error during login:', err);
        }

        await connectDB();
        const user = await User.findOne({ email, active: true, deletedAt: null });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      try {
        const headerList = headers();
        const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
        await logActivity({
          userId: user.id || '',
          userName: user.name || 'Admin',
          userEmail: user.email || '',
          action: 'login',
          module: 'auth',
          details: 'User logged in successfully',
          ipAddress: ip,
        });
      } catch (err) {
        console.error('Failed to log signIn event:', err);
      }
    },
  },
});


