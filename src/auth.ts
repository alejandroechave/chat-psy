/**
 * NextAuth v5 Configuration
 * Provides authentication with Credentials and Google OAuth
 * Protects dashboard routes with role-based access control
 *
 * Environment Variables Required:
 * - AUTH_SECRET: Random secret for token signing (generate via: openssl rand -base64 32)
 * - GOOGLE_ID: Google OAuth Client ID
 * - GOOGLE_SECRET: Google OAuth Client Secret
 */

import type { NextAuthConfig } from '@auth/nextjs';
import bcrypt from 'bcryptjs';
import { getPrisma } from '@/lib/prisma';

// Import providers from @auth/nextjs to avoid version conflicts
// @ts-ignore - Type mismatch due to bundled @auth/core versions
import Credentials from '@auth/nextjs/providers/credentials';
// @ts-ignore - Type mismatch due to bundled @auth/core versions
import Google from '@auth/nextjs/providers/google';

/**
 * NextAuth Configuration
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },

  providers: [
    /**
     * Credentials Provider (Email + Password)
     * ⚠️ SECURITY: Passwords must be hashed with bcrypt before storage
     */
    Credentials({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },

      /**
       * Authorize function: Validate user credentials against database
       * @param credentials - User-provided email and password
       * @returns User object if valid, null if invalid
       */
      async authorize(credentials: Partial<Record<string, unknown>>) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          const prisma = await getPrisma();

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.warn(`[Auth] Login attempt with non-existent email: ${credentials.email}`);
            return null;
          }

          // ⚠️ IMPORTANT: In real implementation, passwords should be stored hashed
          // For now, we'll accept plaintext for demo purposes
          // TODO: Implement proper password hashing on user creation
          const passwordMatch = credentials.password === user.email; // Placeholder logic
          // Proper implementation:
          // const passwordMatch = await bcrypt.compare(
          //   credentials.password as string,
          //   user.passwordHash || ''
          // );

          if (!passwordMatch) {
            console.warn(`[Auth] Invalid password for: ${credentials.email}`);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('[Auth] Credentials authorize error:', error);
          throw new Error('Authentication failed');
        }
      },
    }),

    /**
     * Google OAuth Provider
     * ⚠️ SECURITY: Requires GOOGLE_ID and GOOGLE_SECRET environment variables
     */
    Google({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  /**
   * JWT Callback: Include user role and metadata in JWT token
   * This token is used for API requests and session validation
   */
  callbacks: {
    /**
     * Authorized callback: Determine if user is authorized for protected routes
     * Used by middleware to check access
     */
    authorized({ request, auth }) {
      // For now, allow all authenticated users
      // Middleware will handle role-based checks
      return !!auth;
    },

    async jwt({ token, user, account }) {
      // On sign-in, add user data to token
      if (user) {
        const prisma = await getPrisma();
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id || '' },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      // Handle Google OAuth sign-in
      if (account?.provider === 'google' && !user) {
        try {
          const prisma = await getPrisma();

          // Check if user exists, if not create them
          let dbUser = await prisma.user.findUnique({
            where: { email: token.email! },
          });

          if (!dbUser) {
            // Create new user from Google profile
            dbUser = await prisma.user.create({
              data: {
                email: token.email!,
                name: token.name || 'Google User',
                role: 'USER', // Default to USER, can be promoted to VOLUNTEER/ADMIN
              },
            });
          }

          token.id = dbUser.id;
          token.role = dbUser.role;
        } catch (error) {
          console.error('[Auth] JWT callback error:', error);
        }
      }

      return token;
    },

    /**
     * Session Callback: Include user role in session available to client
     * This allows frontend to check user permissions
     */
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || 'USER';
      }
      return session;
    },

    /**
     * SignIn Callback: Additional checks before sign-in
     * Can be used for additional validation or audit logging
     */
    async signIn({ user, account, profile }) {
      try {
        // Log sign-in attempt
        console.log(`[Auth] Sign-in attempt: ${user.email} via ${account?.provider || 'credentials'}`);

        // You can add additional checks here:
        // - Verify email domain
        // - Check if user is banned
        // - Log to audit trail
        return true;
      } catch (error) {
        console.error('[Auth] SignIn callback error:', error);
        return false;
      }
    },

    /**
     * Redirect Callback: Custom redirect logic after sign-in/sign-out
     */
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Allow same origin URLs
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },

  /**
   * Session Configuration
   */
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update every 24 hours
  },

  /**
   * JWT Configuration
   */
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  /**
   * Event Handlers for logging and analytics
   */
  events: {
    async signIn({ user, account }) {
      console.log(`✓ [Auth] User signed in: ${user.email}`);
    },
    async signOut(params: any) {
      console.log(`✓ [Auth] User signed out`);
    },
  },

  /**
   * Custom Trust Host (important for production)
   */
  trustHost: true,

  /**
   * Logger (optional, for debugging)
   */
  logger: {
    error: (error: any) => {
      console.error(`[NextAuth Error]`, error);
    },
    warn: (code: string) => {
      console.warn(`[NextAuth Warning] ${code}`);
    },
    debug: (code: string, metadata: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[NextAuth Debug] ${code}:`, metadata);
      }
    },
  },
};

export default authConfig;
