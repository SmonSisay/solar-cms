import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'editor' | 'content_manager';
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'super_admin' | 'admin' | 'editor' | 'content_manager';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'super_admin' | 'admin' | 'editor' | 'content_manager';
  }
}
