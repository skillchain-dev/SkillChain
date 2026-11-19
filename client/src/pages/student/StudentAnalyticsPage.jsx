import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function StudentAnalyticsPage() {
  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Analytics" title="Your activity" description="See how your profile and applications are performing — views, match scores and response rates." />
        <EmptyState
          title="This section is still being built"
          description="This page is wired into navigation and routing, ready for the team member owning this feature to fill in."
        />
      </div>
    </DashboardLayout>
  );
}
