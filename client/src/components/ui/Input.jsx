import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, className = '', containerClassName = '', id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-forest-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={`w-full rounded border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors
          placeholder:text-mist-500
          ${error ? 'border-danger-500 focus:border-danger-500' : 'border-mist-300 focus:border-clay-500'}
          ${className}`}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-danger-600">{error}</p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-mist-600">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
