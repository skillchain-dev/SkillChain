import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import JobCard from '../../features/jobs/JobCard.jsx';
import { jobsApi } from '../../features/jobs/api.js';
import { skillsApi } from '../../features/skills/api.js';

/**
 * JobDiscoveryPage — /jobs
 *
 * Lists open roles with AI-powered match scores based on skills the student
 * has saved (or detected from their resume).
 */
export default function JobDiscoveryPage() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({});
  const [matchScores, setMatchScores] = useState({});
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [studentSkills, setStudentSkills] = useState([]);
  const [skillsError, setSkillsError] = useState('');
  const [matchError, setMatchError] = useState('');

  const change = (key) => (event) =>
    setFilters((prev) => ({ ...prev, [key]: event.target.value }));

  // Fetch job list
  useEffect(() => {
    setLoadingJobs(true);
    jobsApi
      .list(filters)
      .then(({ data }) => setJobs(data.data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoadingJobs(false));
  }, [filters]);

  useEffect(() => {
    skillsApi.list()
      .then(({ data }) => setStudentSkills(data.data.map((skill) => skill.name)))
      .catch((error) => setSkillsError(error.message || 'Could not load your skills.'));
  }, []);

  // After jobs load, compute AI match scores for each
  const computeMatches = useCallback(async (jobList) => {
    if (!studentSkills.length || !jobList.length) return;
    const scores = {};
    let failed = false;
    await Promise.all(
      jobList.map(async (job) => {
        try {
          const { data } = await skillsApi.match(
            studentSkills,
            job.requiredSkills || []
          );
          scores[job._id] = data.data.score;
        } catch {
          failed = true;
        }
      })
    );
    setMatchScores(scores);
    if (failed) setMatchError('Some match scores could not be calculated.');
  }, [studentSkills]);

  useEffect(() => {
    if (jobs.length) computeMatches(jobs);
  }, [jobs, computeMatches]);

  return (
    <DashboardLayout role="student">
      <div style={{ width: 'min(1120px, 88%)', margin: '0 auto' }}>
        <section className="page-heading">
          <div>
            <p className="eyebrow">Opportunity board</p>
            <h1>Find work that fits.</h1>
            <p className="muted">
              Search roles matched to your verified skills and ambitions.
              {studentSkills.length > 0 && (
                <span style={{ color: '#d3784d', marginLeft: 6, fontWeight: 600 }}>
                  ✦ AI match scores enabled
                </span>
              )}
            </p>
          </div>
        </section>

        <div className="filters">
          <input placeholder="Search title or company" onChange={change('search')} />
          <input placeholder="Location" onChange={change('location')} />
          <input placeholder="Skills, comma separated" onChange={change('skills')} />
          <select defaultValue="" onChange={change('jobType')}>
            <option value="">All job types</option>
            <option>full-time</option>
            <option>part-time</option>
            <option>internship</option>
            <option>contract</option>
          </select>
        </div>

        {loadingJobs ? (
          <p className="empty">Loading jobs…</p>
        ) : (
          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                matchScore={matchScores[job._id] ?? null}
              />
            ))}
          </div>
        )}
        {skillsError && <p role="alert" className="error">{skillsError}</p>}
        {matchError && <p role="status" className="muted">{matchError}</p>}

        {!loadingJobs && !jobs.length && (
          <p className="empty">No open roles match those filters.</p>
        )}

        {!studentSkills.length && !loadingJobs && (
          <p
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: '#809086',
              marginTop: 0,
              paddingBottom: 32,
            }}
          >
            💡 Add skills on the{' '}
            <a href="/student/resume" style={{ color: '#d3784d' }}>
              Resume page
            </a>{' '}
            to see AI match scores for each job.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
