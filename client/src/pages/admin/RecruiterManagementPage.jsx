import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useEffect, useState } from 'react';

export default function RecruiterManagementPage() {
  const [recruiters, setRecruiters] = useState([]);
  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem('skillchain_mock_users') || '[]');
      setRecruiters(users.filter((user) => user.role === 'recruiter'));
    } catch { setRecruiters([]); }
  }, []);
  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Recruiters" title="Recruiter directory" description="Manage recruiter accounts — verify companies, and suspend access if needed." />
        {recruiters.length ? (
          <div className="overflow-hidden rounded-card border border-mist-200 bg-white">
            {recruiters.map((recruiter) => (
              <div key={recruiter._id} className="flex items-center justify-between border-b border-mist-100 px-5 py-4 last:border-0">
                <div><p className="font-medium text-ink">{recruiter.name}</p><p className="text-sm text-mist-600">{recruiter.email}</p></div>
                <span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-600">Recruiter</span>
              </div>
            ))}
          </div>
        ) : <div className="rounded-card border border-dashed border-mist-300 bg-white px-6 py-12 text-center text-sm text-mist-600">No recruiter accounts have been created.</div>}
      </div>
    </DashboardLayout>
  );
}
