import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import RoleAnalytics from '../../features/analytics/RoleAnalytics.jsx';

export default function RecruiterAnalyticsPage() {
  return (
    <DashboardLayout role="recruiter">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Analytics" title="Hiring analytics" description="Track applicants per role, time-to-shortlist and where candidates are dropping off." />
        <RoleAnalytics role="recruiter" />
      </div>
    </DashboardLayout>
  );
}
