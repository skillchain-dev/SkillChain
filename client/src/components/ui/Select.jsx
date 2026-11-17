import { forwardRef, useId } from 'react';

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, className = '', containerClassName = '', id, ...props },
  ref
) {
  const generatedId = useId();
  const selectId = id || generatedId;
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-forest-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error)}
        className={`w-full rounded border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors
          ${error ? 'border-danger-500 focus:border-danger-500' : 'border-mist-300 focus:border-clay-500'}
          ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-danger-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-mist-600">{hint}</p>
      ) : null}
    </div>
  );
});

export default Select;
