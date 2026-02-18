'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Phone, Clock, AlertCircle, CheckCircle2, Filter } from 'lucide-react';

type CrisisSeverity = 'critical' | 'stable' | 'in-process';
type CrisisType = 'anxiety' | 'grief' | 'ideation' | 'other';

interface CaseRecord {
  id: string;
  userId: string;
  severity: CrisisSeverity;
  waitTime: number; // in minutes
  crisisType: CrisisType;
  userName: string;
  assignedTo?: string;
  notes?: string;
}

// Mock data for active cases
const MOCK_CASES: CaseRecord[] = [
  {
    id: 'CASE-001',
    userId: 'USR-4521',
    severity: 'critical',
    waitTime: 8,
    crisisType: 'ideation',
    userName: 'María G.',
    notes: 'Requiere atención inmediata',
  },
  {
    id: 'CASE-002',
    userId: 'USR-3847',
    severity: 'critical',
    waitTime: 5,
    crisisType: 'anxiety',
    userName: 'Carlos P.',
    notes: 'Ataque de pánico',
  },
  {
    id: 'CASE-003',
    userId: 'USR-2965',
    severity: 'stable',
    waitTime: 15,
    crisisType: 'grief',
    userName: 'Ana M.',
    assignedTo: 'Dr. López',
    notes: 'En consulta',
  },
  {
    id: 'CASE-004',
    userId: 'USR-5128',
    severity: 'in-process',
    waitTime: 3,
    crisisType: 'anxiety',
    userName: 'Juan R.',
    assignedTo: 'Psic. Silva',
  },
  {
    id: 'CASE-005',
    userId: 'USR-1843',
    severity: 'stable',
    waitTime: 22,
    crisisType: 'other',
    userName: 'Rosa T.',
  },
  {
    id: 'CASE-006',
    userId: 'USR-6234',
    severity: 'critical',
    waitTime: 12,
    crisisType: 'ideation',
    userName: 'Lucas D.',
    notes: 'Pensamiento suicida (bajo riesgo)',
  },
];

const SEVERITY_CONFIG = {
  critical: {
    label: 'Crítico',
    badgeVariant: 'danger' as const,
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    textClass: 'text-red-900',
  },
  stable: {
    label: 'Estable',
    badgeVariant: 'warning' as const,
    bgClass: 'bg-yellow-50',
    borderClass: 'border-yellow-200',
    textClass: 'text-yellow-900',
  },
  'in-process': {
    label: 'En Proceso',
    badgeVariant: 'info' as const,
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-900',
  },
};

const CRISIS_TYPE_LABELS: Record<CrisisType, string> = {
  anxiety: 'Ansiedad',
  grief: 'Duelo',
  ideation: 'Ideación Suicida',
  other: 'Otro',
};

export interface VolunteerDashboardProps {
  className?: string;
  onCaseSelect?: (caseId: string, userId: string) => void;
}

/**
 * VolunteerDashboard Component
 * Admin panel for psychologists and first responders to manage active cases
 * Features severity filters, wait time tracking, and case assignment
 */
export const VolunteerDashboard = React.forwardRef<
  HTMLDivElement,
  VolunteerDashboardProps
>(({ className = '', onCaseSelect }, ref) => {
  const [selectedSeverity, setSelectedSeverity] = useState<CrisisSeverity | 'all'>('all');
  const [sortBy, setSortBy] = useState<'waitTime' | 'severity'>('waitTime');

  // Filter and sort cases
  const filteredAndSortedCases = useMemo(() => {
    let filtered = MOCK_CASES;

    // Filter by severity
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter((c) => c.severity === selectedSeverity);
    }

    // Sort cases
    if (sortBy === 'waitTime') {
      filtered.sort((a, b) => b.waitTime - a.waitTime); // Higher wait time first
    } else {
      const severityOrder = { critical: 0, stable: 1, 'in-process': 2 };
      filtered.sort(
        (a, b) =>
          severityOrder[a.severity as CrisisSeverity] -
          severityOrder[b.severity as CrisisSeverity],
      );
    }

    return filtered;
  }, [selectedSeverity, sortBy]);

  const criticalCount = MOCK_CASES.filter((c) => c.severity === 'critical').length;
  const stableCount = MOCK_CASES.filter((c) => c.severity === 'stable').length;
  const inProcessCount = MOCK_CASES.filter((c) => c.severity === 'in-process').length;

  return (
    <div ref={ref} className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Casos</h1>
            <p className="text-gray-600 mt-1">
              Gestión de casos activos en tiempo real
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {MOCK_CASES.length} casos activos
            </p>
            <p className="text-sm text-gray-600">Actualizado en tiempo real</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-red-50 border-red-200">
            <CardBody className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium">Críticos</p>
                <p className="text-3xl font-bold text-red-900">{criticalCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </CardBody>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardBody className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">Estables</p>
                <p className="text-3xl font-bold text-yellow-900">{stableCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </CardBody>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardBody className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">En Proceso</p>
                <p className="text-3xl font-bold text-blue-900">{inProcessCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por severidad
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSeverity('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedSeverity === 'all'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                  aria-pressed={selectedSeverity === 'all'}
                >
                  Todos ({MOCK_CASES.length})
                </button>
                <button
                  onClick={() => setSelectedSeverity('critical')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedSeverity === 'critical'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-red-100 text-red-900 hover:bg-red-200 border border-red-300'
                  }`}
                  aria-pressed={selectedSeverity === 'critical'}
                >
                  🔴 Críticos ({criticalCount})
                </button>
                <button
                  onClick={() => setSelectedSeverity('stable')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedSeverity === 'stable'
                      ? 'bg-yellow-600 text-white shadow-md'
                      : 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200 border border-yellow-300'
                  }`}
                  aria-pressed={selectedSeverity === 'stable'}
                >
                  🟡 Estables ({stableCount})
                </button>
                <button
                  onClick={() => setSelectedSeverity('in-process')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedSeverity === 'in-process'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-blue-100 text-blue-900 hover:bg-blue-200 border border-blue-300'
                  }`}
                  aria-pressed={selectedSeverity === 'in-process'}
                >
                  🔵 En Proceso ({inProcessCount})
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium"
              >
                <option value="waitTime">Tiempo de Espera (Mayor primero)</option>
                <option value="severity">Severidad</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Cases Table */}
      <Card className="overflow-hidden">
        <CardBody className="p-0">
          {/* Mobile view - Card stack */}
          <div className="md:hidden space-y-3 p-4">
            {filteredAndSortedCases.map((caseRecord) => {
              const severityConfig = SEVERITY_CONFIG[caseRecord.severity];
              return (
                <div
                  key={caseRecord.id}
                  className={`p-4 rounded-lg border-2 ${severityConfig.bgClass} ${severityConfig.borderClass}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{caseRecord.userName}</p>
                        <p className="text-xs text-gray-600">{caseRecord.userId}</p>
                      </div>
                      <Badge variant={severityConfig.badgeVariant} size="sm">
                        {severityConfig.label}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">Crisis:</span>{' '}
                        {CRISIS_TYPE_LABELS[caseRecord.crisisType]}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Espera:</span> {caseRecord.waitTime} min
                      </p>
                      {caseRecord.assignedTo && (
                        <p className="text-gray-700">
                          <span className="font-medium">Asignado a:</span> {caseRecord.assignedTo}
                        </p>
                      )}
                      {caseRecord.notes && (
                        <p className="text-gray-600 italic text-xs">{caseRecord.notes}</p>
                      )}
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => onCaseSelect?.(caseRecord.id, caseRecord.userId)}
                      className="flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Atender Ahora
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop view - Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Usuario ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                    Tiempo de Espera
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Tipo de Crisis
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Asignado a
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedCases.map((caseRecord, index) => {
                  const severityConfig = SEVERITY_CONFIG[caseRecord.severity];
                  return (
                    <tr
                      key={caseRecord.id}
                      className={`border-b border-gray-200 transition-colors duration-200 hover:bg-gray-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-mono text-sm text-gray-900">
                        {caseRecord.userId}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{caseRecord.userName}</p>
                          {caseRecord.notes && (
                            <p className="text-xs text-gray-600 mt-1">{caseRecord.notes}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={severityConfig.badgeVariant}>
                          {severityConfig.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-900">
                            {caseRecord.waitTime} min
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {CRISIS_TYPE_LABELS[caseRecord.crisisType]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {caseRecord.assignedTo || '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onCaseSelect?.(caseRecord.id, caseRecord.userId)}
                          className="flex items-center justify-center gap-1"
                        >
                          <Phone className="w-4 h-4" />
                          Atender
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Empty State */}
      {filteredAndSortedCases.length === 0 && (
        <Card className="text-center py-12">
          <CardBody>
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              No hay casos en esta categoría
            </p>
            <p className="text-gray-600">
              {selectedSeverity === 'all'
                ? 'Todos los casos están siendo atendidos'
                : 'Selecciona otro filtro para ver casos'}
            </p>
          </CardBody>
        </Card>
      )}

      {/* Legend */}
      <Card className="bg-gray-50">
        <CardBody>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Leyenda de Severidad</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-red-500 flex-shrink-0"></div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Crítico</p>
                <p className="text-gray-600 text-xs">Requiere atención inmediata</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-yellow-500 flex-shrink-0"></div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Estable</p>
                <p className="text-gray-600 text-xs">Situación controlada</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-blue-500 flex-shrink-0"></div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">En Proceso</p>
                <p className="text-gray-600 text-xs">En consulta o evaluación</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
});

VolunteerDashboard.displayName = 'VolunteerDashboard';
