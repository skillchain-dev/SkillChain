import { useState, useRef } from 'react';
import { resumeApi } from './api.js';

/**
 * ResumeUpload.jsx
 *
 * Accepts either a plain-text paste or a .txt file (read as text).
 * Calls POST /api/ai/resume/analyze and passes the result up via onResult().
 *
 * Props:
 *  onResult      {fn({skills, source})}  Called with the parsed AI result
 *  onError       {fn(errorMessage)}      Called on failure
 *  onTextChange  {fn(text)}             Optional. Keeps parent in sync with current text
 */
export default function ResumeUpload({ onResult, onError, onTextChange }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  function updateText(value) {
    setText(value);
    onTextChange?.(value);
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => updateText(evt.target.result || '');
    reader.readAsText(file);
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
        Upload a resume file (.txt)
        <input
          ref={fileRef}
          type="file"
          accept=".txt,text/plain"
          onChange={handleFile}
          style={{ marginTop: 8 }}
        />
      </label>

      <label style={{ marginTop: 18, display: 'block' }}>
        — or paste your resume text —
        <textarea
          value={text}
          onChange={(e) => updateText(e.target.value)}
          rows={10}
          placeholder="Paste your resume content here…"
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
          {loading ? 'Analysing…' : '✦ Analyse with AI'}
        </button>
      </div>
    </div>
  );
}
