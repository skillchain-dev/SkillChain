import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import SkillMatrix from '../../features/skills/SkillMatrix.jsx';
import { skillsApi } from '../../features/skills/api.js';

/**
 * MySkillsPage — /student/skills
 *
 * Lets students manage their skill list manually. Skills extracted from
 * the Resume page and manual additions are stored in the account API.
 */
export default function MySkillsPage() {
  const [skills, setSkills] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleChange(newSkills) {
    setSkills(newSkills);
    setSaved(false);
  }

  const load = useCallback(async () => {
    try {
      const { data } = await skillsApi.list();
      setSkills(data.data);
    } catch (requestError) {
      setError(requestError.message || 'Could not load skills.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setError('');
    setSaving(true);
    try {
      const { data } = await skillsApi.list();
      const previous = data.data;
      const keep = new Set(skills.map((skill) => skill._id).filter(Boolean));
      const remove = previous.filter((skill) => !keep.has(skill._id)).map((skill) => skillsApi.remove(skill._id));
      const existingNames = new Set(previous.filter((skill) => keep.has(skill._id)).map((skill) => skill.name.toLowerCase()));
      const add = skills.filter((skill) => !skill._id && !existingNames.has(skill.name.toLowerCase()))
        .map((skill) => skillsApi.add({ name: skill.name }));
      await Promise.all([...remove, ...add]);
      await load();
      setSaved(true);
    } catch (requestError) {
      setError(requestError.message || 'Could not save skills.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader
          eyebrow="Skills"
          title="Your skills"
          description="Add the skills you want matched against job postings. Skills extracted from your resume appear here automatically."
          actions={
            <button
              type="button"
              className="button primary"
              onClick={handleSave}
              disabled={loading || saving}
            >
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save skills'}
            </button>
          }
        />

        <div className="form-card">
          {error && <p role="alert" className="error">{error}</p>}
          {loading && <p className="muted">Loading skills…</p>}
          <p className="eyebrow" style={{ marginBottom: 14 }}>
            Your skill set ({skills.length})
          </p>
          <SkillMatrix skills={skills} onChange={handleChange} />
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #e2e9e2',
            borderRadius: 5,
            padding: '18px 22px',
          }}
        >
          <p className="eyebrow" style={{ marginBottom: 8 }}>
            💡 Tip
          </p>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            Go to the{' '}
            <a href="/student/resume" style={{ color: '#d3784d', fontWeight: 600 }}>
              Resume page
            </a>{' '}
            to let SkillChain's AI automatically extract skills from your CV, then
            come back here to review and edit them.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
