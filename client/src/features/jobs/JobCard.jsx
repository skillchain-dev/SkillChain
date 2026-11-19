import { Link } from 'react-router-dom';

/**
 * JobCard.jsx
 *
 * Renders a single job listing card in the discovery grid.
 * Optionally shows an AI match score badge when `matchScore` is provided.
 *
 * Props:
 *  job        {object}  Job document
 *  matchScore {number}  0-100 (optional — shown when present)
 */
export default function JobCard({ job, matchScore }) {
  const scoreColour =
    matchScore == null
      ? null
      : matchScore >= 70
      ? '#23724e'
      : matchScore >= 40
      ? '#bd7a2b'
      : '#b05243';

  return (
    <Link className="job-card" to={`/jobs/${job._id}`}>
      <div className="card-top">
        <span className="tag">{job.jobType}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="muted" style={{ fontSize: 11 }}>
            {job.location}
          </span>
          {matchScore != null && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: scoreColour,
                background: `${scoreColour}18`,
                borderRadius: 3,
                padding: '2px 6px',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              {matchScore}% match
            </span>
          )}
        </div>
      </div>
      <h2 style={{ margin: '10px 0 4px', fontSize: 16 }}>{job.title}</h2>
      <p className="company">{job.companyName}</p>
      <p className="muted clamp">{job.description}</p>
      <div className="skill-row">
        {(job.requiredSkills || []).slice(0, 5).map((skill) => (
          <span className="skill" key={skill}>
            {skill}
          </span>
        ))}
        {job.requiredSkills?.length > 5 && (
          <span className="skill" style={{ color: '#809086', background: '#f0f3f0' }}>
            +{job.requiredSkills.length - 5}
          </span>
        )}
      </div>
      <p className="deadline">
        Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
      </p>
    </Link>
  );
}

