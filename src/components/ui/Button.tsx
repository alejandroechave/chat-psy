import React, { ReactNode } from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
      secondary:
        'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400',
      accent:
        'bg-accent text-gray-900 hover:bg-accent-dark focus:ring-accent',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const computedClassName = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      widthClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={computedClassName} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
