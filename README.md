# Chat Psy - Breathing Exercises Application

Una aplicación moderna de ejercicios de respiración guiados construida con **Next.js 14**, **TypeScript**, y **Tailwind CSS**.

## 🎯 Características

- ✅ **Ejercicios de Respiración Guiados**: Box Breathing, Deep Breathing, Tactical Breathing
- ✅ **Interfaz Accesible (A11y)**: ARIA labels y navegación por teclado
- ✅ **Paleta de Colores "Calm"**: Diseño relajante y visual
- ✅ **Componentes Reutilizables**: UI components con Clean Code principles
- ✅ **TypeScript**: Type-safe development
- ✅ **Tailwind CSS v4**: Styling moderno y eficiente
- ✅ **App Router**: Última arquitectura de Next.js

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router pages y layouts
│   ├── layout.tsx         # Root layout con metadata
│   ├── page.tsx           # Home page con ejercicios
│   └── globals.css        # Estilos globales y paleta Calm
├── components/
│   ├── ui/                # Componentes reutilizables
│   │   ├── Button.tsx     # Botón accesible
│   │   ├── Card.tsx       # Tarjeta con subcomponentes
│   │   ├── Container.tsx  # Contenedor responsive
│   │   └── index.ts       # Barrel exports (sin export default)
│   └── sections/          # Secciones de landing
│       ├── HeroSection.tsx
│       └── index.ts
├── lib/                    # Utilidades y constantes
│   ├── constants.ts       # Paleta de colores, configuraciones
│   ├── utils.ts           # Funciones auxiliares puras
│   └── index.ts           # Barrel exports
└── hooks/                  # Lógica de ejercicios
    ├── useBreathingExercise.ts
    └── index.ts
```

## 🚀 Inicio Rápido

### Requisitos previos
- Node.js 18+ 
- npm, yarn, pnpm, o bun

### Instalación
```

### Desarrollo

```bash
npm run dev
```
npm run start
```

## 🎨 Paleta de Colores "Calm"

La aplicación utiliza una paleta de colores relajante:

| Color | Valor | Uso |
|-------|-------|-----|
| **Primary** (Azul suave) | `#4A90E2` | Botones, CTAs principales |
| **Background** (Gris casi blanco) | `#F5F7FA` | Fondo general |
| **Accent** (Verde menta) | `#A8E6CF` | Acentos, elementos secundarios |

Accesibles vía `CALM_COLORS` constant en `src/lib/constants.ts`

## 📦 Componentes UI Disponibles

### Button
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="lg">
  Click me
</Button>
```

**Props**: `variant` (primary|secondary|accent), `size` (sm|md|lg), `fullWidth`

### Card
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui';

<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

### Container
```tsx
import { Container } from '@/components/ui';

<Container size="lg">
  Responsive container content
</Container>
```

## 🧘 Hooks Disponibles

### useBreathingExercise
```tsx
import { useBreathingExercise } from '@/hooks';

const { phase, isActive, startExercise, stopExercise } = useBreathingExercise({
  inhaleCount: 4,
  holdCount: 4,
  exhaleCount: 4,
  cycles: 5
});
```

## 🌟 Principios de Clean Code

- ✅ **Named Exports**: No se usan export default innecesarios
- ✅ **Barrel Exports**: Archivos `index.ts` centralizan exports
- ✅ **Type Safety**: Interfaces (`Props`) para componentes
- ✅ **Accesibilidad**: ARIA labels, semantic HTML, focus visible
- ✅ **Funciones Puras**: Utilidades en `src/lib/utils.ts`
- ✅ **Componentes Reutilizables**: Props bien documentadas

## ♿ Accesibilidad (A11y)

- ARIA labels en elementos interactivos
- Focus styles visibles (`focus-visible`)
- Soporte para `prefers-reduced-motion`
- Semantic HTML (main, section, header, footer, etc.)
- Botones accesibles con feedback visual
- Color utilizado no es el único medio de diferenciación

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor desarrollo |
| `npm run build` | Compila la aplicación |
| `npm run start` | Inicia servidor producción |
| `npm run lint` | Ejecuta ESLint |

## 🔧 Configuración

### TypeScript
- `tsconfig.json`: Strict mode habilitado
- Path aliases: `@/*` para imports relativos a `src/`

### Tailwind CSS
- `tailwind.config.ts`: Paleta Calm personalizada
- `src/app/globals.css`: Estilos base y CSS custom properties

### ESLint
- `eslint.config.mjs`: Configuración Next.js + TypeScript

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 📄 Licencia

Este proyecto está bajo licencia MIT.

---

Hecho con ❤️ para Chat Psy

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
