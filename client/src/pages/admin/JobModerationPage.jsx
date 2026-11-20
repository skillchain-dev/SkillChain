import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { useEffect, useState } from 'react';

const JOBS_KEY = 'skillchain_moderation_jobs';

export default function JobModerationPage() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    try { setJobs(JSON.parse(localStorage.getItem(JOBS_KEY) || '[]')); } catch { setJobs([]); }
  }, []);
  function updateStatus(id, status) {
    const next = jobs.map((job) => job.id === id ? { ...job, status } : job);
    setJobs(next);
    localStorage.setItem(JOBS_KEY, JSON.stringify(next));
  }
  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Job moderation" title="Job moderation" description="Review job posts before they go live, and take down anything that violates platform guidelines." />
        {jobs.length ? (
          <div className="space-y-3">{jobs.map((job) => (
            <article key={job.id} className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-mist-200 bg-white p-5">
              <div><h3 className="font-display font-semibold text-forest-700">{job.title}</h3><p className="text-sm text-mist-600">{job.companyName}</p></div>
              <div className="flex gap-2"><button type="button" onClick={() => updateStatus(job.id, 'rejected')} className="rounded border border-danger-200 px-3 py-1.5 text-xs font-semibold text-danger-600">Reject</button><button type="button" onClick={() => updateStatus(job.id, 'approved')} className="rounded bg-forest-600 px-3 py-1.5 text-xs font-semibold text-white">Approve</button></div>
            </article>
          ))}</div>
        ) : <EmptyState title="No jobs need review" description="Approved and rejected jobs will appear here when moderation records are available." />}
      </div>
    </DashboardLayout>
  );
}
