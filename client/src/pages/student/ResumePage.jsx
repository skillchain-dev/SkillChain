import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import ResumeUpload from '../../features/resumes/ResumeUpload.jsx';
import ResumePreview from '../../features/resumes/ResumePreview.jsx';
import ParseResultPanel from '../../features/resumes/ParseResultPanel.jsx';
import { skillsApi } from '../../features/skills/api.js';

/**
 * ResumePage — /student/resume
 *
 * Lets a student paste or upload resume text, then sends it to the AI
 * parsing endpoint to extract normalised skills.
 */
export default function ResumePage() {
  const [resumeText, setResumeText] = useState('');
  const [parseResult, setParseResult] = useState(null);
  const [error, setError] = useState('');
  const [skillsSaved, setSkillsSaved] = useState(false);

  async function handleResult(result) {
    setParseResult(result);
    setError('');
    setSkillsSaved(false);
    try {
      const { data } = await skillsApi.list();
      const existing = new Set(data.data.map((skill) => skill.name.toLowerCase()));
      const newSkills = result.skills.filter((skill) => !existing.has(skill.name.toLowerCase()));
      await Promise.all(newSkills.map((skill) => skillsApi.add({ name: skill.name })));
      setSkillsSaved(true);
    } catch (requestError) {
      setError(requestError.message || 'Resume was parsed, but extracted skills could not be saved.');
    }
  }

  function handleError(msg) {
    setError(msg);
    setParseResult(null);
  }

  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader
          eyebrow="Resume"
          title="Your resume"
          description="Upload a resume and let SkillChain's AI parse it into structured skills and experience."
        />

        {error && (
          <p className="error" style={{ marginTop: 0 }}>
            {error}
          </p>
        )}

        {/* Upload / paste area */}
        <ResumeUpload
          onResult={(result) => {
            // Keep the text visible in the preview
            handleResult(result);
          }}
          onError={handleError}
          onTextChange={setResumeText}
        />

        {/* Parse result */}
        <ParseResultPanel result={parseResult} />
        {skillsSaved && <p role="status" className="muted">Extracted skills were added to your profile. Review them on the Skills page.</p>}

        {/* Raw text preview */}
        <ResumePreview text={resumeText} />
      </div>
    </DashboardLayout>
  );
}
