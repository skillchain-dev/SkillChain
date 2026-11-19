import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';

// Generic filter row: a search box plus any number of select filters, driven entirely by props
// so each feature (jobs, candidates, students…) can describe its own filters without a new component.
export default function SearchFilterBar({ searchValue, onSearchChange, searchPlaceholder = 'Search…', filters = [], className = '' }) {
  return (
    <div className={`grid gap-3 sm:grid-cols-[2fr_repeat(auto-fit,minmax(140px,1fr))] ${className}`}>
      <Input
        value={searchValue}
        onChange={(event) => onSearchChange?.(event.target.value)}
        placeholder={searchPlaceholder}
        aria-label="Search"
      />
      {filters.map((filter) => (
        <Select
          key={filter.name}
          value={filter.value}
          onChange={(event) => filter.onChange?.(event.target.value)}
          options={filter.options}
          placeholder={filter.placeholder}
          aria-label={filter.placeholder || filter.name}
        />
      ))}
    </div>
  );
}
