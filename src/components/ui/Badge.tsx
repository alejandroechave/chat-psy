import React, { ReactNode } from 'react';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

/**
 * Badge Component
 * Used to display status indicators and labels with semantic styling
 * Supports multiple variants with high contrast for accessibility
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center font-semibold rounded-full whitespace-nowrap transition-colors duration-200';

    const sizeStyles = {
      sm: 'px-2.5 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
    };

    const variantStyles = {
      default: 'bg-gray-200 text-gray-900',
      primary: 'bg-blue-100 text-blue-900 border border-blue-300',
      success: 'bg-green-100 text-green-900 border border-green-300',
      warning: 'bg-yellow-100 text-yellow-900 border border-yellow-300',
      danger: 'bg-red-100 text-red-900 border border-red-300',
      info: 'bg-cyan-100 text-cyan-900 border border-cyan-300',
    };

    const computedClassName = [
      baseStyles,
      sizeStyles[size],
      variantStyles[variant],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={computedClassName} {...props}>
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
