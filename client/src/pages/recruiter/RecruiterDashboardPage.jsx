import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DashboardStats from '../../features/dashboard/DashboardStats.jsx';
import ActivityFeed from '../../features/dashboard/ActivityFeed.jsx';
import { dashboardApi } from '../../features/dashboard/api.js';
import { useAuth } from '../../features/auth/useAuth.js';
import Button from '../../components/ui/Button.jsx';

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.recruiterSummary()
      .then(setSummary)
      .catch(() => setSummary({ jobs: [] }))
      .finally(() => setLoading(false));
  }, []);

  const jobs = summary?.jobs ?? [];
  const openJobs = jobs.filter((job) => job.status !== 'closed').length;

  const stats = [
    { label: 'Open roles', value: openJobs },
    { label: 'Total roles posted', value: jobs.length },
    { label: 'Closed roles', value: jobs.length - openJobs },
    { label: 'Company profile', value: 'In progress', hint: 'Complete your company page' },
  ];

  return (
    <DashboardLayout role="recruiter">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader
          eyebrow="Recruiter workspace"
          title={`Welcome back${user?.name ? `, ${user.name.split(' ')[0]}` : ''}`}
          description="Track your open roles and see where candidates stand."
          actions={<Link to="/recruiter/jobs/new"><Button>Post a job</Button></Link>}
        />

        <DashboardStats stats={stats} loading={loading} />

        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-forest-700">Your roles</h2>
          <ActivityFeed
            loading={loading}
            emptyTitle="You haven't posted a role yet"
            items={jobs.slice(0, 8).map((job) => ({
              id: job._id,
              title: job.title,
              description: job.status ? `Status: ${job.status}` : undefined,
              timestamp: job.createdAt,
            }))}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}
