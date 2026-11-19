import { useState } from 'react';

export default function Tabs({ tabs = [], defaultValue, value, onChange, className = '' }) {
  const [internalValue, setInternalValue] = useState(defaultValue || tabs[0]?.value);
  const activeValue = value ?? internalValue;

  function selectTab(nextValue) {
    if (onChange) onChange(nextValue);
    else setInternalValue(nextValue);
  }

  return (
    <div className={className}>
      <div role="tablist" className="flex gap-1 border-b border-mist-200">
        {tabs.map((tab) => {
          const isActive = tab.value === activeValue;
          return (
            <button
              key={tab.value}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => selectTab(tab.value)}
              className={`relative -mb-px px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none
                ${isActive ? 'text-forest-700' : 'text-mist-600 hover:text-forest-500'}`}
            >
              {tab.label}
              {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-clay-500" />}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (tab.value === activeValue ? (
        <div key={tab.value} role="tabpanel" className="pt-5">{tab.content}</div>
      ) : null))}
    </div>
  );
}
