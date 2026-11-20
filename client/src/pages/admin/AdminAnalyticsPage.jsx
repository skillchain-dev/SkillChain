import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';

export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Analytics" title="Placement analytics" description="Platform-wide trends across students, recruiters, jobs and certificate approvals." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Students" value="0" hint="Registered student accounts" />
          <StatCard label="Recruiters" value="0" hint="Verified employer accounts" />
          <StatCard label="Open jobs" value="0" hint="Currently accepting applications" />
          <StatCard label="Pending certificates" value="0" hint="Waiting for faculty review" />
        </div>
      </div>
    </DashboardLayout>
  );
}
