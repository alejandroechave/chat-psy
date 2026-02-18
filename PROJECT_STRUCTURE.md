# 📊 Estructura del Proyecto Chat Psy

```
chat-psy/
│
├── 📁 .github/
│   └── 📄 copilot-instructions.md      # Instrucciones para desarrollo
│
├── 📁 .vscode/
│   ├── 📄 settings.json                # Config de VS Code
│   └── 📄 tasks.json                   # Tasks del proyecto
│
├── 📁 src/                              # Código fuente principal
│   ├── 📁 app/                          # Next.js App Router
│   │   ├── 📄 layout.tsx                # Root layout con metadata
│   │   ├── 📄 globals.css               # Estilos globales + Calm palette
│   │   └── 📄 page.tsx                  # Home page con ejercicios
│   │
│   ├── 📁 components/                   # Componentes React
│   │   ├── 📁 ui/                       # Componentes reutilizables
│   │   │   ├── 📄 Button.tsx            # Botón accesible (3 variantes, 3 tamaños)
│   │   │   ├── 📄 Card.tsx              # Card + CardHeader/Body/Footer
│   │   │   ├── 📄 Container.tsx         # Contenedor responsive
│   │   │   └── 📄 index.ts              # Barrel export (named exports)
│   │   │
│   │   └── 📁 sections/                 # Secciones de landing
│   │       ├── 📄 HeroSection.tsx       # Sección hero principal
│   │       └── 📄 index.ts              # Barrel export
│   │
│   ├── 📁 lib/                          # Utilidades y constantes
│   │   ├── 📄 constants.ts              # Paleta Calm, ejercicios, A11y
│   │   ├── 📄 utils.ts                  # Funciones puras auxiliares
│   │   └── 📄 index.ts                  # Barrel export
│   │
│   └── 📁 hooks/                        # Custom React Hooks
│       ├── 📄 useBreathingExercise.ts   # Lógica de ejercicios de respiración
│       └── 📄 index.ts                  # Barrel export
│
├── 📁 public/                           # Archivos estáticos
│
├── 📁 node_modules/                     # Dependencias (no commitar)
│
├── 📁 .next/                            # Build output (no commitar)
│
├── 📄 .gitignore                        # Git ignores
├── 📄 .prettierrc                       # Config Prettier
├── 📄 .prettierignore                   # Prettier ignores
├── 📄 eslint.config.mjs                 # ESLint + TypeScript + A11y rules
├── 📄 next.config.ts                    # Config Next.js
├── 📄 tailwind.config.ts                # Config Tailwind + Calm palette
├── 📄 tsconfig.json                     # Config TypeScript (strict mode)
├── 📄 postcss.config.mjs                # Config PostCSS
│
├── 📄 package.json                      # Dependencias y scripts
├── 📄 package-lock.json                 # Lock file
│
├── 📄 README.md                         # Documentación principal
├── 📄 QUICKSTART.md                     # Guía de inicio rápido
└── 📄 next-env.d.ts                     # TypeScript definitions
```

---

## 📦 Instaladas (key packages)

```json
{
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "typescript": "^5",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/node": "^20"
  }
}
```

---

## 🎨 Paleta de Colores "Calm"

```typescript
CALM_COLORS = {
  primary: '#4A90E2',           // Azul suave
  primaryLight: '#6BA3E8',
  primaryLighter: '#8DB4EE',
  primaryDark: '#2E5FA3',
  
  background: '#F5F7FA',        // Gris casi blanco
  backgroundDark: '#E8ECEF',
  
  accent: '#A8E6CF',            // Verde menta suave
  accentLight: '#C5F0D8',
  accentLighter: '#E0F5EA',
  accentDark: '#6DD4A8'
}
```

---

## 🚀 Scripts Disponibles

| Script | Función |
|--------|---------|
| `npm run dev` | Inicia servidor de desarrollo (hot reload) |
| `npm run build` | Compila para producción |
| `npm run start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta ESLint |

---

## ✨ Características Implementadas

- ✅ **Next.js 14 (v16)** con App Router
- ✅ **TypeScript** strict mode habilitado
- ✅ **Tailwind CSS v4** con paleta Calm personalizada
- ✅ **Componentes Reutilizables** (Button, Card, Container)
- ✅ **Secciones** (HeroSection para landing)
- ✅ **Hooks Personalizados** (useBreathingExercise)
- ✅ **Clean Code Principles** (named exports, Props interfaces)
- ✅ **Accesibilidad A11y** (ARIA labels, semantic HTML, focus styles)
- ✅ **Linting ESLint** con rules de TypeScript y accesibilidad
- ✅ **Formatting Prettier** automático on save
- ✅ **Documentación Completa** (README, QUICKSTART, Copilot instructions)

---

## 🎯 Próximos Pasos Sugeridos

1. **Iniciar desarrollo**: `npm run dev`
2. **Explorar componentes**: Ver ejemplos en `src/components/ui/`
3. **Extender funcionalidad**: Agregar más secciones en `src/components/sections/`
4. **Crear nuevos hooks**: Seguir patrón de `useBreathingExercise`
5. **Agregar más constantes**: Expandir `src/lib/constants.ts`

---

**Proyecto listo para desarrollar. ¡Feliz codificación! 🎉**
