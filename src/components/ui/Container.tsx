import React, { ReactNode } from 'react';

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className = '', size = 'lg', children, ...props }, ref) => {
    const sizeStyles = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      full: 'w-full',
    };

    const computedClassName = [
      `mx-auto px-4 ${sizeStyles[size]}`,
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

Container.displayName = 'Container';
