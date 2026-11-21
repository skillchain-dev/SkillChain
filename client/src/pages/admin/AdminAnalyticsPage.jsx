import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import RoleAnalytics from '../../features/analytics/RoleAnalytics.jsx';

export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Analytics" title="Placement analytics" description="Platform-wide trends across students, recruiters, jobs and certificate approvals." />
        <RoleAnalytics role="admin" />
      </div>
    </DashboardLayout>
  );
}
