'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui';
import { useCrisisSession } from '@/hooks/useCrisisSession';

// Schema
const PostCrisisSchema = z.object({
  riskLevel: z.number().min(1).max(5),
  summary: z.string().min(10, 'Resumen demasiado corto').max(2000),
  referral: z.enum(['Hospital', 'LineaTelefonica', 'Terapia', 'Ninguna']),
  selfCare: z.array(z.string()).optional(),
});

type PostCrisisValues = z.infer<typeof PostCrisisSchema>;

const LOCAL_STORAGE_KEY = 'post_crisis_draft';

export default function PostCrisisForm({ session }: { session?: any }) {

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostCrisisValues>({
    resolver: zodResolver(PostCrisisSchema),
    defaultValues: {
      riskLevel: 3,
      summary: '',
      referral: 'Ninguna',
      selfCare: [],
    },
  });

  // Autosave (draft)
  const watched = watch();
  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watched));
      } catch (e) {
        console.warn('Autosave failed', e);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [watched]);

  // Load draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        reset(parsed);
      }
    } catch (e) {
      // ignore
    }
  }, [reset]);

  const onSubmit = async (data: PostCrisisValues) => {
    try {
      // Log succinctly
      console.info('Post-crisis form submitted', { riskLevel: data.riskLevel });

      // Optionally send to backend (not implemented here)
      // await api.post('/post-crisis', data)

      // Clear draft
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (e) {}

      // Clean global session state
      if (session?.closeSession) {
        await session.closeSession();
      } else if (session?.forceCleanup) {
        await session.forceCleanup();
      }

      // Reset UI
      reset({ riskLevel: 3, summary: '', referral: 'Ninguna', selfCare: [] });
    } catch (error) {
      console.error('Error submitting post-crisis form', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-md shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nivel de riesgo final (1-5)</label>
        <div className="mt-2 flex gap-2">
          {[1,2,3,4,5].map((n) => (
            <label key={n} className="inline-flex items-center gap-2">
              <input type="radio" value={n} {...register('riskLevel', { valueAsNumber: true })} />
              <span className="text-sm text-gray-700">{n}</span>
            </label>
          ))}
        </div>
        {errors.riskLevel && <p className="text-xs text-red-600">{String(errors.riskLevel.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Resumen de la intervención</label>
        <textarea {...register('summary')} rows={6} className="mt-2 block w-full rounded-md border border-gray-200 bg-white p-2 text-sm" />
        {errors.summary && <p className="text-xs text-red-600">{String(errors.summary.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Derivación efectuada</label>
        <select {...register('referral')} className="mt-2 block w-full rounded-md border border-gray-200 bg-white p-2 text-sm">
          <option value="Hospital">Hospital</option>
          <option value="LineaTelefonica">Línea telefónica</option>
          <option value="Terapia">Terapia particular</option>
          <option value="Ninguna">Ninguna</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estado emocional del voluntario (autocuidado)</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {['Descansar', 'Pedir supervisión', 'Respiración', 'Pausa breve'].map((item) => (
            <label key={item} className="inline-flex items-center gap-2">
              <input type="checkbox" value={item} {...register('selfCare')} className="h-4 w-4" />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Enviar y Cerrar
        </Button>
      </div>
    </form>
  );
}
