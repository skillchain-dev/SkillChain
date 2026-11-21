import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jobsApi } from '../../features/jobs/api.js';
import { applicationsApi } from '../../features/applications/api.js';
import { skillsApi } from '../../features/skills/api.js';
import MatchScore from '../../features/jobs/MatchScore.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [studentSkills, setStudentSkills] = useState([]);
  const [skillsError, setSkillsError] = useState('');

  useEffect(() => {
    jobsApi.get(id).then(({ data }) => setJob(data.data));
    skillsApi.list()
      .then(({ data }) => setStudentSkills(data.data.map((skill) => skill.name)))
      .catch((error) => setSkillsError(error.message || 'Could not load your skills.'));
  }, [id]);

  // Compute AI match once job is loaded
  useEffect(() => {
    if (!job || !studentSkills.length) return;
    setMatchLoading(true);
    skillsApi
      .match(studentSkills, job.requiredSkills || [])
      .then(({ data }) => setMatchResult(data.data))
      .catch(() => setMatchResult(null))
      .finally(() => setMatchLoading(false));
  }, [job, studentSkills]);

  if (!job)
    return (
      <DashboardLayout role="student">
        <p className="muted" style={{ padding: 32 }}>
          Loading job…
        </p>
      </DashboardLayout>
    );

  const apply = async (event) => {
    event.preventDefault();
    try {
      await applicationsApi.apply(id, { coverLetter });
      setMessage('Application submitted.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not submit application.');
    }
  };

  return (
    <DashboardLayout role="student">
      <Link className="back-link" to="/jobs">
        ← Back to jobs
      </Link>
      <article className="detail-layout">
        <div>
          <p className="eyebrow">
            {job.companyName} · {job.location}
          </p>
          <h1>{job.title}</h1>
          <p className="muted">
            {job.jobType} · Apply by{' '}
            {new Date(job.applicationDeadline).toLocaleDateString()}
          </p>
          <div className="prose-block">
            <h2>About the role</h2>
            <p>{job.description}</p>
            <h2>Eligibility</h2>
            <p>{job.eligibilityCriteria}</p>
            <h2>Required skills</h2>
            <div className="skill-row">
              {job.requiredSkills.map((skill) => (
                <span className="skill" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* AI Match Score panel */}
          {(matchResult || matchLoading) && (
            <div style={{ marginTop: 32 }}>
              <h2 style={{ marginBottom: 14 }}>Your match</h2>
              <MatchScore {...(matchResult || {})} loading={matchLoading} />
            </div>
          )}
          {skillsError && <p role="alert" className="error">{skillsError}</p>}

          {!studentSkills.length && (
            <p
              className="muted"
              style={{ marginTop: 24, fontSize: 12, fontStyle: 'italic' }}
            >
              💡 Add your skills on the{' '}
              <a href="/student/resume" style={{ color: '#d3784d' }}>
                Resume page
              </a>{' '}
              to see your AI match score for this job.
            </p>
          )}
        </div>

        <form className="apply-panel" onSubmit={apply}>
          <p className="eyebrow">Ready to apply?</p>
          <h2>Make your case.</h2>
          <textarea
            value={coverLetter}
            onChange={(event) => setCoverLetter(event.target.value)}
            placeholder="A short note to the hiring team"
            rows="8"
          />
          <button className="button primary">Submit application</button>
          {message && <p className="form-message">{message}</p>}
        </form>
      </article>
    </DashboardLayout>
  );
}
