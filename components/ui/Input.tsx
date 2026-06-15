import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      icon,
      containerClassName,
      id,
      type = 'text',
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID for aria descriptions if none is provided
    const inputId = id || React.useId();
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold tracking-wider text-primary uppercase select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              cn(
                error ? errorId : undefined,
                helperText ? helperId : undefined
              ) || undefined
            }
            className={cn(
              'w-full h-11 text-sm bg-white border rounded-components transition-all duration-200 outline-none text-primary placeholder:text-slate-400 font-sans',
              icon ? 'pl-11 pr-4' : 'px-4',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary',
              disabled && 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed select-none',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-red-500 transition-all duration-200 mt-0.5"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-xs text-slate-400 mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
