import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';

export default function StudentAnalyticsPage() {
  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Analytics" title="Your activity" description="See how your profile and applications are performing — views, match scores and response rates." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Profile views" value="0" hint="Starts after recruiters view your profile" />
          <StatCard label="Applications" value="0" hint="Open your application tracker" />
          <StatCard label="Shortlisted" value="0" hint="No shortlist updates yet" />
          <StatCard label="Profile strength" value="25%" hint="Add a profile, skills and projects" />
        </div>
      </div>
    </DashboardLayout>
  );
}
