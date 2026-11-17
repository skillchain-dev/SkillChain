import { useRef, useState } from 'react';
import { formatFileSize } from '../../utils/formatFileSize.js';

export default function FileUploader({ label = 'Upload a file', accept, maxSizeMb = 5, file, onSelect, error, hint }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(fileList) {
    const picked = fileList?.[0];
    if (picked) onSelect?.(picked);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-forest-700">{label}</label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click(); }}
        onDragOver={(event) => { event.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => { event.preventDefault(); setDragOver(false); handleFiles(event.dataTransfer.files); }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed px-6 py-8 text-center transition-colors
          ${dragOver ? 'border-clay-500 bg-clay-50' : 'border-mist-300 bg-white hover:border-forest-500'}`}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mb-2 text-mist-500" aria-hidden="true">
          <path d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {file ? (
          <p className="text-sm font-medium text-forest-700">{file.name} <span className="text-mist-600">({formatFileSize(file.size)})</span></p>
        ) : (
          <p className="text-sm text-mist-600">Drag a file here, or <span className="font-semibold text-clay-500">browse</span></p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-danger-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-mist-600">{hint || `Max ${maxSizeMb}MB`}</p>
      ) : null}
    </div>
  );
}
