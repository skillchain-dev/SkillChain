import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import SkillMatrix from '../../features/skills/SkillMatrix.jsx';

/**
 * MySkillsPage — /student/skills
 *
 * Lets students manage their skill list manually. Skills extracted from
 * the Resume page can be surfaced here via localStorage or future API.
 */
export default function MySkillsPage() {
  const [skills, setSkills] = useState([]);
  const [saved, setSaved] = useState(false);

  function handleChange(newSkills) {
    setSkills(newSkills);
    setSaved(false);
  }

  function handleSave() {
    // In a full implementation this would call a skills API endpoint.
    // For now it stores locally so the UI is interactive end-to-end.
    try {
      localStorage.setItem('skillchain:skills', JSON.stringify(skills));
      setSaved(true);
    } catch {
      // ignore storage errors
    }
  }

  // Load from localStorage on mount
  useState(() => {
    try {
      const stored = localStorage.getItem('skillchain:skills');
      if (stored) setSkills(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  });

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
              disabled={skills.length === 0}
            >
              {saved ? 'Saved ✓' : 'Save skills'}
            </button>
          }
        />

        <div className="form-card">
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
