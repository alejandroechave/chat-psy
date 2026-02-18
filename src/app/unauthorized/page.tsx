'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, LogOut } from 'lucide-react';

/**
 * Unauthorized Access Page
 * Displayed when a user lacks the required role for a protected route
 */
export default function UnauthorizedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Acceso Denegado
        </h1>

        {/* Error Code */}
        <p className="text-center text-gray-500 text-sm mb-6">
          Error 403: Forbidden
        </p>

        {/* Message */}
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
          <p className="text-red-700 text-sm text-center">
            No tienes permisos para acceder a esta sección. Solo los usuarios con roles
            <strong> VOLUNTEER </strong> o <strong> ADMIN </strong> pueden acceder al
            dashboard.
          </p>
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-600 text-sm mb-8">
          Si crees que esto es un error, contacta al administrador o intenta acceder
          con una cuenta diferente.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleGoBack}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver Atrás
          </button>
          <a
            href="/api/auth/signout"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </a>
        </div>
      </div>
    </div>
  );
}
