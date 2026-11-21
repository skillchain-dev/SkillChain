import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { adminApi } from '../../features/admin/api.js';

export default function JobModerationPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    adminApi.jobs()
      .then(({ data }) => setJobs(data.data.jobs))
      .catch((requestError) => setError(requestError.message || 'Could not load jobs.'));
  }, []);

  async function updateStatus(id, status) {
    try {
      await adminApi.moderateJob(id, status);
      setJobs((current) => current.map((job) => job._id === id ? { ...job, status } : job));
    } catch (requestError) {
      setError(requestError.message || 'Could not update job status.');
    }
  }

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Job moderation" title="Job moderation" description="Review current job postings and change their publication status." />
        {error && <p role="alert" className="error">{error}</p>}
        <div className="space-y-3">
          {jobs.map((job) => (
            <article key={job._id} className="form-card flex flex-wrap items-center justify-between gap-4">
              <div><h2 className="font-semibold">{job.title}</h2><p className="muted">{job.companyName} · {job.location}</p></div>
              <div className="flex items-center gap-3">
                <span className={`status ${job.status}`}>{job.status}</span>
                <select aria-label={`Set status for ${job.title}`} value={job.status} onChange={(event) => updateStatus(job._id, event.target.value)}>
                  <option value="open">Open</option><option value="draft">Draft</option><option value="closed">Closed</option>
                </select>
              </div>
            </article>
          ))}
          {!jobs.length && !error && <p className="muted">No jobs to moderate.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
