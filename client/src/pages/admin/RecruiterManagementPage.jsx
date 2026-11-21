import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { adminApi } from '../../features/admin/api.js';

export default function RecruiterManagementPage() {
  const [recruiters, setRecruiters] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    adminApi.recruiters()
      .then(({ data }) => setRecruiters(data.data.recruiters))
      .catch((requestError) => setError(requestError.message || 'Could not load recruiters.'));
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Recruiters" title="Recruiter directory" description="Review recruiter accounts and their registration details." />
        {error && <p role="alert" className="error">{error}</p>}
        <div className="space-y-3">
          {recruiters.map((recruiter) => (
            <article key={recruiter._id} className="form-card flex flex-wrap justify-between gap-2">
              <strong>{recruiter.name}</strong><span>{recruiter.email}</span>
              <span className="muted">Joined {new Date(recruiter.createdAt).toLocaleDateString()}</span>
            </article>
          ))}
          {!recruiters.length && !error && <p className="muted">No recruiter accounts found.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
