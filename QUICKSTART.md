# 🚀 Quick Start Guide - Chat Psy

## Installation & Setup

El proyecto ha sido completamente configurado. Solo necesitas:

```bash
cd c:\Proyectos\Apps\chat-psy
npm run dev
```

Y luego abre: **http://localhost:3000**

## ✨ Qué se ha configurado

### ✅ Next.js 14 (v16.1.6)
- TypeScript habilitado por defecto
- App Router configurado
- Carpeta `src/` estructurada

### ✅ Tailwind CSS v4  
- Paleta de colores "Calm" personalizada
- Estilos base con clean class organization
- Dark mode support (opcional)

### ✅ Componentes Reutilizables
- `Button`: Botones accesibles con variantes
- `Card`: Tarjetas con subcomponentes (Header, Body, Footer)
- `Container`: Contenedor responsive
- Todos con Named Exports (sin export default)

### ✅ Hooks Personalizados
- `useBreathingExercise`: Lógica de ejercicios de respiración
- Tipos TypeScript completos

### ✅ Utilidades
- `constants.ts`: Paleta Calm, configuraciones de ejercicios
- `utils.ts`: Funciones puras y helpers
- Barrel exports en cada carpeta

### ✅ Accesibilidad A11y
- ARIA labels en elementos interactivos
- Focus visible styles
- Semantic HTML
- Soporte para prefers-reduced-motion

### ✅ Clean Code
- Named exports únicamente
- Props interfaces tipadas
- ESLint con reglas de accesibilidad
- Prettier configurado

## 📂 Estructura Rápida

```
src/
├── app/                 # Páginas y layouts
├── components/
│   ├── ui/             # Button, Card, Container
│   └── sections/       # HeroSection
├── lib/                # constants.ts, utils.ts
└── hooks/              # useBreathingExercise
```

## 🎨 Colores Disponibles

| Nombre | Color | Uso |
|--------|-------|-----|
| Primary | #4A90E2 | Botones principales, CTA |
| Background | #F5F7FA | Fondo general |
| Accent | #A8E6CF | Acentos, elementos secundarios |

Accede con: `CALM_COLORS` desde `@/lib`

## 📖 Scripts

```bash
npm run dev       # Desarrollo (hot reload)
npm run build     # Compilación de producción
npm run start     # Inicia servidor de producción
npm run lint      # Ejecuta ESLint
```

## 🔧 Configuración VS Code

Ya está configurado con:
- Prettier formatting on save
- ESLint auto-fix on save
- TypeScript support

## 📚 Próximos Pasos

1. **Agregar más componentes**: Sigue el patrón en `src/components/ui/Button.tsx`
2. **Crear nuevas secciones**: Agrega en `src/components/sections/`
3. **Más hooks**: Crea en `src/hooks/useFeatureName.ts`
4. **Constantes**: Agrega en `src/lib/constants.ts`

## 💡 Ejemplo: Agregar un componente

```tsx
// src/components/ui/Badge.tsx
import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'accent';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', className = '', ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-block px-2 py-1 rounded text-sm font-semibold bg-${variant}`}
      {...props}
    />
  )
);

Badge.displayName = 'Badge';
```

Luego exporta en `src/components/ui/index.ts`:

```tsx
export type { BadgeProps } from './Badge';
export { Badge } from './Badge';
```

## 🆘 Troubleshooting

**Error: "next not found"**
```bash
npm install
```

**Puerto 3000 en uso:**
```bash
npm run dev -- -p 3001
```

**Limpiar caché:**
```bash
rm -r .next
npm run dev
```

---

¡El proyecto está listo para desarrollar! 🎉
