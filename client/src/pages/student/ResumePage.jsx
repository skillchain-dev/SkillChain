import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import ResumeUpload from '../../features/resumes/ResumeUpload.jsx';
import ResumePreview from '../../features/resumes/ResumePreview.jsx';
import ParseResultPanel from '../../features/resumes/ParseResultPanel.jsx';

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

  function handleResult(result) {
    setParseResult(result);
    setError('');
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

        {/* Raw text preview */}
        <ResumePreview text={resumeText} />
      </div>
    </DashboardLayout>
  );
}
