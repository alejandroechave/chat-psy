# Chat Psy - Copilot Instructions

## Project Overview

Chat Psy is a Next.js 14 application with TypeScript and Tailwind CSS that provides guided breathing exercises with a "Calm" color palette.

## Code Standards

### 1. Clean Code Principles

- **Named Exports Only**: Avoid default exports. Use named exports in all components and utilities.
- **Barrel Exports**: Use `index.ts` files in directories to centralize exports (e.g., `src/components/ui/index.ts`).
- **Type Safety**: Define `Props` interfaces for all components.
- **Pure Functions**: Keep utility functions in `src/lib/utils.ts` pure and testable.
- **Descriptive Names**: Use clear, intention-revealing names for variables and functions.

### 2. Accessibility (A11y) Requirements

- **ARIA Labels**: Add `aria-label` to all interactive elements without visible text.
- **Semantic HTML**: Use `<main>`, `<section>`, `<header>`, `<footer>` elements.
- **Focus Visible**: All focusable elements have visible focus styles.
- **Keyboard Navigation**: Ensure all features are accessible via keyboard.
- **Color Independence**: Never rely on color alone to convey information.
- **Prefers Reduced Motion**: Respect `prefers-reduced-motion` preference (CSS: `@media (prefers-reduced-motion: reduce)`).

### 3. TypeScript Practices

- **Strict Mode**: Project uses `strict: true` in tsconfig.json.
- **No `any` Type**: Use proper types instead of `any`.
- **Enums**: Use `as const` over enums for better tree-shaking.
- **Type Imports**: Import types with `import type` syntax.

### 4. Component Structure

**UI Components** (`src/components/ui/`):
- Use `React.forwardRef` for components that need ref forwarding.
- Export `Props` interface for type documentation.
- Use `displayName` for debugging.

Example:
```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', ...props }, ref) => (
    <button ref={ref} className={`btn btn-${variant}`} {...props} />
  )
);

Button.displayName = 'Button';
```

### 5. File Organization

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── sections/           # Landing page sections
│   └── index.ts            # Barrel export
├── lib/                    # Utilities and constants
│   ├── constants.ts        # App-wide constants
│   ├── utils.ts            # Pure utility functions
│   └── index.ts            # Barrel export
└── hooks/                  # Custom React hooks
    └── index.ts            # Barrel export
```

### 6. Styling with Tailwind CSS

- **Avoid Inline Styles**: Use Tailwind classes only.
- **Color Palette**: Use colors from `CALM_COLORS` constant:
  - Primary: `#4A90E2` (blue)
  - Background: `#F5F7FA` (light gray)
  - Accent: `#A8E6CF` (mint green)
- **Custom Utilities**: Add to `tailwind.config.ts` for reusable patterns.

### 7. Hooks and State Management

- **useBreathingExercise**: Custom hook for breathing exercise logic.
- **Client Components**: Mark with `'use client'` directive.
- **Prop Drilling**: Keep props at minimum depth; use context if needed.

### 8. ESLint Rules

Key rules enabled:
- `@typescript-eslint/explicit-function-return-types`: Functions must have explicit return types.
- `@typescript-eslint/consistent-type-imports`: Use `import type` for types.
- `jsx-a11y/*`: Accessibility rules enforced.

**To run linter**: `npm run lint`

## Development Workflow

### Starting Development

```bash
npm run dev
```

Open http://localhost:3000

### Building for Production

```bash
npm run build
npm run start
```

### Before Committing

1. Run linter: `npm run lint`
2. Check for TypeScript errors
3. Test accessibility with browser DevTools
4. Ensure all components use named exports

## Common Tasks

### Adding a New UI Component

1. Create file in `src/components/ui/ComponentName.tsx`
2. Define `Props` interface extending HTML attributes
3. Use `React.forwardRef` if needed
4. Add `displayName`
5. Export in `src/components/ui/index.ts`

Example:
```tsx
// src/components/ui/Badge.tsx
import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', className = '', ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-${variant}`}
      {...props}
    />
  )
);

Badge.displayName = 'Badge';
```

### Adding a New Hook

1. Create file in `src/hooks/useFeatureName.ts`
2. Export interfaces and hook function
3. Add to `src/hooks/index.ts`

### Adding Constants

1. Add to `src/lib/constants.ts` or create new file
2. Export in `src/lib/index.ts`
3. Use throughout app with: `import { CONSTANT_NAME } from '@/lib'`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Web Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)

## Questions or Issues?

Refer to the main `README.md` for more information about the project structure and available commands.
