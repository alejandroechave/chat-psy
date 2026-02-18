import React, { ReactNode } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className = '', variant = 'default', children, ...props },
    ref,
  ) => {
    const baseStyles =
      'rounded-lg p-6 bg-white transition-shadow duration-200';

    const variantStyles = {
      default: 'border border-gray-200 shadow-sm hover:shadow-md',
      elevated: 'shadow-lg group hover:shadow-xl',
    };

    const computedClassName = [
      baseStyles,
      variantStyles[variant],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={computedClassName} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

/**
 * Card Header Component
 * Provides semantic structure for card titles
 */
export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`mb-4 pb-4 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Body Component
 * Main content area of the card
 */
export interface CardBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  ),
);

CardBody.displayName = 'CardBody';

/**
 * Card Footer Component
 * Controls and actions area
 */
export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`mt-6 pt-4 border-t border-gray-200 flex gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
);

CardFooter.displayName = 'CardFooter';
