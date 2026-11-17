import { useState } from 'react';

// Lightweight file-picker state helper: validates size/type before handing the file to a caller-supplied uploader.
export function useFileUpload({ maxSizeMb = 5, acceptedTypes } = {}) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  function selectFile(nextFile) {
    setError('');
    if (!nextFile) { setFile(null); return; }
    if (acceptedTypes && !acceptedTypes.includes(nextFile.type)) {
      setError('That file type is not supported');
      return;
    }
    if (nextFile.size > maxSizeMb * 1024 * 1024) {
      setError(`File must be smaller than ${maxSizeMb}MB`);
      return;
    }
    setFile(nextFile);
  }

  async function upload(uploaderFn) {
    if (!file) return null;
    setUploading(true);
    setError('');
    try {
      return await uploaderFn(file);
    } catch (err) {
      setError(err?.message || 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }

  function reset() { setFile(null); setError(''); }

  return { file, error, uploading, selectFile, upload, reset };
}
