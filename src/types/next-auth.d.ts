import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    role: 'user' | 'admin';
    provider?: string;
    emailVerified?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'user' | 'admin';
      image: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'user' | 'admin';
    email?: string;
    name?: string;
    picture?: string;
    provider?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}