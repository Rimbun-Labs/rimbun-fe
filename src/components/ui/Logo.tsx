import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'footer' | 'header';
  textClassName?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md',
  showText = false,
  variant = 'default',
  textClassName
}) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn(
        "rounded-full flex items-center justify-center overflow-hidden bg-transparent",
        sizeClasses[size],
        variant === 'footer' && "shadow-lg",
        variant === 'header' && "shadow-md"
      )}>
        <img 
          src="/logo.svg" 
          alt="Rimbun Logo" 
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to PNG if SVG doesn't exist
            const target = e.target as HTMLImageElement;
            if (target.src.endsWith('.svg')) {
              target.src = '/logo.png';
            }
          }}
        />
      </div>
      {showText && (
        <span className={cn(
          "font-semibold",
          size === 'sm' && "text-sm",
          size === 'md' && "text-base",
          size === 'lg' && "text-xl",
          textClassName
        )}>
          Rimbun
        </span>
      )}
    </div>
  );
};

