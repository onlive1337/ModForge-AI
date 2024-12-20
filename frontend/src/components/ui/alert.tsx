import React from 'react';
import { cn } from '../../lib/utils'

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
}

export function Alert({ 
  children, 
  variant = 'default', 
  className 
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4",
        variant === 'destructive' ? 'border-red-200 bg-red-50 text-red-800' : 'bg-gray-50 border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
}

export function AlertTitle({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h5 className={cn("mb-1 font-medium", className)}>
      {children}
    </h5>
  );
}

export function AlertDescription({ 
  children,
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-sm", className)}>
      {children}
    </div>
  );
}