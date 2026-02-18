'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

/**
 * Login Content Component
 * Extracted to handle useSearchParams() within Suspense boundary
 */
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const paramError = searchParams.get('error');

  React.useEffect(() => {
    if (paramError === 'session_expired') {
      setError('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
    }
  }, [paramError]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // TODO: Implement credentials login via NextAuth
      // For now, show a placeholder message
      setError('La autenticación por credenciales está en desarrollo. Usa Google OAuth por ahora.');
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // TODO: Implement Google OAuth login via NextAuth
      // signIn('google', { redirect: true, redirectTo: callbackUrl })
      setError('Google OAuth está en desarrollo.');
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error con Google OAuth');
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Credentials Form */}
      <form onSubmit={handleCredentialsLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voluntario@example.com"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">O continúa con</span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-100 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isLoading ? 'Conectando...' : 'Continuar con Google'}
      </button>

      {/* Demo Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-medium mb-1">🧪 Modo Desarrollo</p>
        <p>Email: <code className="bg-white px-2 py-1 rounded">demo@example.com</code></p>
        <p>Password: <code className="bg-white px-2 py-1 rounded">password123</code></p>
      </div>
    </>
  );
}

/**
 * Login Page
 * Provides Credentials (email/password) and OAuth authentication options
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏥 Chat Psy
          </h1>
          <p className="text-gray-600">
            Plataforma de apoyo en crisis para voluntarios
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <Suspense fallback={<div className="text-center py-4">Cargando...</div>}>
            <LoginContent />
          </Suspense>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-8">
          ¿Problemas para acceder?{' '}
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Contacta soporte
          </a>
        </p>
      </div>
    </div>
  );
}
