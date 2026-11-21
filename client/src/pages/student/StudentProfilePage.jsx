import { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { profileApi } from '../../features/profile/api.js';
import httpClient from '../../services/httpClient.js';

export default function StudentProfilePage() {
  const [values, setValues] = useState({ college: '', branch: '', graduationYear: '', phone: '', bio: '', resumeUrl: '' });
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    profileApi.mine()
      .then(({ data }) => setValues((current) => ({
        ...current,
        ...data.data,
        graduationYear: data.data.graduationYear || '',
        resumeUrl: data.data.resumeUrl || '',
      })))
      .catch((requestError) => setError(requestError.message || 'Could not load your profile.'))
      .finally(() => setLoading(false));
  }, []);

  function update(field) {
    return (event) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setSaved(false);
    };
  }

  async function handleResumeUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Resume file must be smaller than 10MB.');
      return;
    }

    setUploadingResume(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'resumes');

      const response = await httpClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = response.data?.data?.url || '';
      setValues((current) => ({ ...current, resumeUrl: uploadedUrl }));
      setSaved(false);
    } catch (uploadErr) {
      console.warn('Resume upload notice:', uploadErr);
      setError(uploadErr.message || 'Resume upload failed. You can paste an external URL instead.');
    } finally {
      setUploadingResume(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await profileApi.update(values);
      setValues((current) => ({ ...current, ...data.data }));
      setSaved(true);
    } catch (requestError) {
      setError(requestError.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader
          eyebrow="Profile"
          title="Your public profile"
          description="Build the profile recruiters see when they open your candidate card — headline, education, links and a short bio."
        />
        <form className="form-card space-y-4" onSubmit={submit}>
          {error && <p role="alert" className="error">{error}</p>}
          {loading && <p className="muted">Loading profile…</p>}
          <label>College<input value={values.college} onChange={update('college')} /></label>
          <label>Branch<input value={values.branch} onChange={update('branch')} /></label>
          <label>Graduation year<input type="number" min="1900" max="2200" value={values.graduationYear} onChange={update('graduationYear')} /></label>
          <label>Phone<input type="tel" value={values.phone} onChange={update('phone')} /></label>
          <label>Bio<textarea rows="5" maxLength="2000" value={values.bio} onChange={update('bio')} /></label>

          {/* Resume Upload & Link */}
          <div className="border-t border-mist-200 pt-4 mt-4 space-y-3">
            <h3 className="font-display text-sm font-semibold text-forest-700">Resume / CV</h3>
            <label className="block text-xs font-medium text-mist-600">
              Resume URL (Cloudinary, Drive, or LinkedIn)
              <input
                type="url"
                value={values.resumeUrl || ''}
                onChange={update('resumeUrl')}
                placeholder="https://..."
                className="mt-1"
              />
            </label>

            <div>
              <label className="block text-xs font-medium text-mist-600 mb-1">
                — Or upload resume file (.pdf, .doc) —
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="text-xs text-mist-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-clay-50 file:text-clay-700 hover:file:bg-clay-100"
              />
              {uploadingResume && <p className="mt-1 text-xs text-clay-600 animate-pulse">Uploading resume to cloud…</p>}
            </div>

            {values.resumeUrl && (
              <div className="mt-2 text-xs">
                <span className="text-emerald-700 font-medium">✓ Resume attached: </span>
                <a
                  href={values.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-clay-600 hover:text-clay-700 underline"
                >
                  View uploaded resume ↗
                </a>
              </div>
            )}
          </div>

          <button className="button primary mt-4" disabled={loading || saving || uploadingResume}>
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save profile'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
