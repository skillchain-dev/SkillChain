import { useState, useRef } from 'react';
import { createCertificate } from './api.js';
import httpClient from '../../services/httpClient.js';

export default function CertificateUpload({ onCreated }) {
  const [values, setValues] = useState({ title: '', issuer: '', issueDate: '' });
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File must be smaller than 10MB.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'certificates');

      const response = await httpClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = response.data?.data?.url || '';
      setFileUrl(uploadedUrl);
      setFileName(file.name);
    } catch (uploadErr) {
      console.warn('File upload notice:', uploadErr);
      setError(uploadErr.message || 'File upload failed. You can still submit certificate details manually.');
    } finally {
      setUploading(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const certificate = await createCertificate({
        ...values,
        fileUrl: fileUrl || undefined,
      });
      setValues({ title: '', issuer: '', issueDate: '' });
      setFileUrl('');
      setFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onCreated?.(certificate);
    } catch (requestError) {
      setError(requestError.message || 'Could not submit certificate.');
    } finally {
      setSaving(false);
    }
  }

  function update(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  }

  return (
    <form className="form-card space-y-4" onSubmit={submit}>
      <h2 className="font-display text-lg font-semibold">Submit a certificate for review</h2>
      {error && <p role="alert" className="error">{error}</p>}
      
      <label>
        Certificate title
        <input required value={values.title} onChange={update('title')} placeholder="e.g. AWS Certified Solutions Architect" />
      </label>
      
      <label>
        Issuing organization
        <input required value={values.issuer} onChange={update('issuer')} placeholder="e.g. Amazon Web Services, Coursera, GLA University" />
      </label>
      
      <label>
        Issue date
        <input type="date" value={values.issueDate} onChange={update('issueDate')} />
      </label>

      <div>
        <label className="block text-sm font-medium text-forest-700 mb-1">
          Certificate document or badge image (Optional)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="text-xs text-mist-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-clay-50 file:text-clay-700 hover:file:bg-clay-100"
        />
        {uploading && <p className="mt-1 text-xs text-clay-600 animate-pulse">Uploading file to Cloudinary…</p>}
        {fileName && !uploading && (
          <p className="mt-1 text-xs text-emerald-700 font-medium">
            ✓ Attached: {fileName}
          </p>
        )}
      </div>

      <button className="button primary" disabled={saving || uploading}>
        {saving ? 'Submitting…' : 'Submit for review'}
      </button>
    </form>
  );
}
