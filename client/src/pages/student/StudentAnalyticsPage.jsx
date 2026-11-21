import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import RoleAnalytics from '../../features/analytics/RoleAnalytics.jsx';

export default function StudentAnalyticsPage() {
  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Analytics" title="Your activity" description="See how your profile and applications are performing — views, match scores and response rates." />
        <RoleAnalytics role="student" />
      </div>
    </DashboardLayout>
  );
}
