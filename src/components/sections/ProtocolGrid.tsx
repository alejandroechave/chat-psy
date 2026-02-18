'use client';

import React, { useState, useMemo } from 'react';
import { PAP_PROTOCOL } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import {
  Ear,
  Shield,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type ProtocolStepId = 'listen' | 'protect' | 'connect';

const ICON_MAP: Record<string, React.ReactNode> = {
  Ear: <Ear className="w-8 h-8" aria-hidden="true" />,
  Shield: <Shield className="w-8 h-8" aria-hidden="true" />,
  Users: <Users className="w-8 h-8" aria-hidden="true" />,
};

export interface ProtocolGridProps {
  className?: string;
  onStepClick?: (stepId: ProtocolStepId) => void;
}

/**
 * ProtocolGrid Component
 * Renders PAP (Psychological First Aid) protocol steps in expandable cards
 * with search functionality and WCAG AA compliant contrast
 */
export const ProtocolGrid = React.forwardRef<
  HTMLDivElement,
  ProtocolGridProps
>(({ className = '', onStepClick }, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSteps, setExpandedSteps] = useState<Set<ProtocolStepId>>(
    new Set(),
  );

  // Filter protocol steps based on search query
  const filteredSteps = useMemo(() => {
    return PAP_PROTOCOL.filter((step) => {
      const query = searchQuery.toLowerCase();
      return (
        step.title.toLowerCase().includes(query) ||
        step.shortDescription.toLowerCase().includes(query) ||
        step.fullDescription.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const toggleExpanded = (stepId: ProtocolStepId) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
    onStepClick?.(stepId);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div ref={ref} className={`w-full ${className}`}>
      {/* Search Section */}
      <div className="mb-10">
        <label htmlFor="protocol-search" className="sr-only">
          Buscar en los pasos de primeros auxilios psicológicos
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" aria-hidden="true" />
          <input
            id="protocol-search"
            type="text"
            placeholder="Buscar pasos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-600"
            aria-label="Buscar pasos del protocolo PAP"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700"
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
        {filteredSteps.length === 0 && searchQuery && (
          <p className="mt-3 text-gray-700 text-center font-medium">
            No se encontraron pasos que coincidan con "{searchQuery}"
          </p>
        )}
      </div>

      {/* Protocol Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {filteredSteps.map((step) => {
          const isExpanded = expandedSteps.has(step.id as ProtocolStepId);

          return (
            <Card
              key={step.id}
              variant="elevated"
              className="flex flex-col h-full transition-all duration-300"
            >
              <CardHeader className="pb-4 border-b-2 border-blue-100">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 text-blue-600 bg-blue-50 p-3 rounded-lg flex items-center justify-center w-14 h-14">
                    {ICON_MAP[step.icon]}
                  </div>

                  {/* Title and Short Description */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-700 leading-snug">
                      {step.shortDescription}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="flex-1 flex flex-col pt-4">
                {/* Expandable Content */}
                {isExpanded && (
                  <div className="space-y-4 mb-4">
                    {/* Full Description */}
                    <div>
                      <p className="text-sm text-gray-800 leading-relaxed font-medium mb-3">
                        {step.fullDescription}
                      </p>
                    </div>

                    {/* How to Apply */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2">
                        Cómo aplicar:
                      </h4>
                      <ul
                        className="space-y-2"
                        role="list"
                        aria-label={`Pasos para aplicar ${step.title}`}
                      >
                        {step.howToApply.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-800 flex gap-2"
                          >
                            <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="pt-0.5">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Toggle Button */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => toggleExpanded(step.id as ProtocolStepId)}
                    variant="secondary"
                    size="sm"
                    className="w-full flex items-center justify-between"
                    aria-expanded={isExpanded}
                    aria-controls={`${step.id}-details`}
                  >
                    <span className="font-medium">
                      {isExpanded ? 'Ver menos' : 'Ver más'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSteps.length === 0 && !searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-700 text-lg font-medium">
            No hay pasos disponibles
          </p>
        </div>
      )}
    </div>
  );
});

ProtocolGrid.displayName = 'ProtocolGrid';
