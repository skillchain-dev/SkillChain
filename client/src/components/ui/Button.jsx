import { forwardRef } from 'react';

const VARIANTS = {
  primary: 'bg-clay-500 text-white hover:bg-clay-600 focus-visible:ring-clay-500',
  secondary: 'bg-forest-100 text-forest-600 hover:bg-forest-100/70 focus-visible:ring-forest-500',
  outline: 'bg-transparent border border-mist-300 text-ink hover:border-forest-500 focus-visible:ring-forest-500',
  ghost: 'bg-transparent text-forest-600 hover:bg-forest-50 focus-visible:ring-forest-500',
  danger: 'bg-danger-50 text-danger-600 hover:bg-danger-50/70 focus-visible:ring-danger-500',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className = '', children, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded font-semibold tracking-tight transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream
        disabled:cursor-not-allowed disabled:opacity-60
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;
