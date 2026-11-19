import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DashboardStats from '../../features/dashboard/DashboardStats.jsx';
import ActivityFeed from '../../features/dashboard/ActivityFeed.jsx';
import { dashboardApi } from '../../features/dashboard/api.js';
import { useAuth } from '../../features/auth/useAuth.js';
import Button from '../../components/ui/Button.jsx';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.studentSummary()
      .then(setSummary)
      .catch(() => setSummary({ applications: [], recommendedJobs: [] }))
      .finally(() => setLoading(false));
  }, []);

  const applications = summary?.applications ?? [];
  const shortlisted = applications.filter((item) => item.status === 'shortlisted').length;

  const stats = [
    { label: 'Applications sent', value: applications.length },
    { label: 'Shortlisted', value: shortlisted },
    { label: 'Open roles to explore', value: summary?.recommendedJobs?.length ?? 0 },
    { label: 'Profile', value: 'In progress', hint: 'Add skills & projects' },
  ];

  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader
          eyebrow="Student workspace"
          title={`Welcome back${user?.name ? `, ${user.name.split(' ')[0]}` : ''}`}
          description="Here's where your applications and job matches stand today."
          actions={<Link to="/jobs"><Button>Find jobs</Button></Link>}
        />

        <DashboardStats stats={stats} loading={loading} />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-forest-700">Recent applications</h2>
            <ActivityFeed
              loading={loading}
              emptyTitle="You haven't applied anywhere yet"
              items={applications.slice(0, 6).map((application) => ({
                id: application._id,
                title: application.job?.title || 'Application',
                description: application.status ? `Status: ${application.status}` : undefined,
                timestamp: application.createdAt,
              }))}
            />
          </section>
          <section>
            <h2 className="mb-3 font-display text-lg font-semibold text-forest-700">Recommended for you</h2>
            <ActivityFeed
              loading={loading}
              emptyTitle="No recommendations yet"
              items={(summary?.recommendedJobs ?? []).slice(0, 6).map((job) => ({
                id: job._id,
                title: job.title,
                description: job.company || job.jobType,
              }))}
            />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
