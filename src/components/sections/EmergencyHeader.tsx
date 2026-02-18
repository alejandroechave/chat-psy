'use client';

import { Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui';

export interface EmergencyHeaderProps {
  onEmergencyClick?: () => void;
}

export function EmergencyHeader({ onEmergencyClick }: EmergencyHeaderProps) {
  const handleEmergencyCall = () => {
    if (onEmergencyClick) {
      onEmergencyClick();
    }
    window.location.href = 'tel:911';
  };

  return (
    <div className="bg-red-50 border-b-2 border-red-200">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Alert Message */}
          <div className="flex items-start gap-3 flex-1">
            <div
              className="flex-shrink-0 mt-0.5"
              aria-label="Alerta de emergencia"
            >
              <div className="h-2 w-2 bg-red-600 rounded-full"></div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-900">
                ¿Estás en crisis?
              </p>
              <p className="text-xs text-red-700 mt-1">
                Si consideras que corre riesgo tu seguridad o la de otros,
                contacta a emergencias.
              </p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Emergency Call Button */}
            <Button
              onClick={handleEmergencyCall}
              className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
              aria-label="Llamar a emergencias 911"
              role="button"
              title="Llamar a emergencias"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm font-semibold">911</span>
            </Button>

            {/* Crisis Lines Link */}
            <a
              href="#crisis-lines"
              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-700 hover:text-red-900 hover:bg-red-100 rounded-lg transition-colors duration-200"
              aria-label="Ver líneas de crisis internacionales"
              title="Líneas de crisis"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              <span className="hidden xs:inline">Crisis</span>
            </a>
          </div>
        </div>

        {/* Mobile-optimized info */}
        <div
          className="mt-3 pt-3 border-t border-red-200 text-xs text-red-700 sm:hidden"
          role="contentinfo"
        >
          Líneas internacionales disponibles. Ayuda disponible 24/7.
        </div>
      </div>
    </div>
  );
}
