import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { profileApi } from '../../features/profile/api.js';

export default function CompanyProfilePage() {
  const [values, setValues] = useState({ companyName: '', position: '', website: '', bio: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    profileApi.mine()
      .then(({ data }) => setValues((current) => ({ ...current, ...data.data })))
      .catch((requestError) => setError(requestError.message || 'Could not load company profile.'))
      .finally(() => setLoading(false));
  }, []);
  function update(field) {
    return (event) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setSaved(false);
    };
  }
  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await profileApi.update(values);
      setSaved(true);
    } catch (requestError) {
      setError(requestError.message || 'Could not save company profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout role="recruiter">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Company profile" title="Company profile" description="Tell candidates about your company — logo, description and the roles you're hiring for." />
        <form className="form-card space-y-4" onSubmit={submit}>
          {error && <p role="alert" className="error">{error}</p>}
          {loading && <p className="muted">Loading profile…</p>}
          <label>Company name<input required value={values.companyName} onChange={update('companyName')} /></label>
          <label>Your position<input value={values.position} onChange={update('position')} /></label>
          <label>Website<input type="url" value={values.website} onChange={update('website')} /></label>
          <label>Company description<textarea rows="5" maxLength="2000" value={values.bio} onChange={update('bio')} /></label>
          <button className="button primary" disabled={loading || saving}>{saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save profile'}</button>
        </form>
      </div>
    </DashboardLayout>
  );
}
