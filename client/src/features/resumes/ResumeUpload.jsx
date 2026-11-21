import { useState, useRef } from 'react';
import { resumeApi } from './api.js';
import httpClient from '../../services/httpClient.js';
import { profileApi } from '../profile/api.js';

/**
 * ResumeUpload.jsx
 *
 * Accepts either a plain-text paste or a resume file.
 * Uploads file to Cloudinary and calls POST /api/ai/resume/analyze.
 */
export default function ResumeUpload({ onResult, onError, onTextChange }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState('');
  const fileRef = useRef(null);

  function updateText(value) {
    setText(value);
    onTextChange?.(value);
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read text if text file
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (evt) => updateText(evt.target.result || '');
      reader.readAsText(file);
    }

    // Also upload to cloud storage
    setUploadNotice('Uploading resume file to cloud…');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'resumes');

      const response = await httpClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = response.data?.data?.url;
      if (uploadedUrl) {
        await profileApi.update({ resumeUrl: uploadedUrl });
        setUploadNotice(`✓ "${file.name}" saved to your cloud profile`);
      }
    } catch (err) {
      console.warn('Resume file cloud upload notice:', err);
      setUploadNotice(`Note: Resume analyzed locally (${err.message})`);
    }
  }

  async function handleAnalyze() {
    if (!text.trim() || text.trim().length < 20) {
      onError?.('Please paste at least 20 characters of resume text.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await resumeApi.analyze(text);
      onResult?.(data.data);
    } catch (err) {
      onError?.(err.message || 'Resume analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-card">
      <label>
        Upload a resume file (.txt, .pdf, .doc)
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.pdf,.doc,.docx,text/plain"
          onChange={handleFile}
          style={{ marginTop: 8 }}
        />
      </label>
      {uploadNotice && (
        <p className="mt-1 text-xs text-clay-700 font-medium">{uploadNotice}</p>
      )}

      <label style={{ marginTop: 18, display: 'block' }}>
        — or paste your resume text —
        <textarea
          value={text}
          onChange={(e) => updateText(e.target.value)}
          rows={10}
          placeholder="Paste your resume content or copy from your PDF/Word doc here…"
          style={{ marginTop: 8 }}
        />
      </label>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <button
          type="button"
          className="button primary"
          onClick={handleAnalyze}
          disabled={loading || text.trim().length < 20}
        >
          {loading ? 'Analysing with Gemini AI…' : '✦ Analyse with AI'}
        </button>
      </div>
    </div>
  );
}
