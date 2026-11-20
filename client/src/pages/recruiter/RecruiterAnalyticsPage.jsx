import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';

export default function RecruiterAnalyticsPage() {
  return (
    <DashboardLayout role="recruiter">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Analytics" title="Hiring analytics" description="Track applicants per role, time-to-shortlist and where candidates are dropping off." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Open roles" value="0" hint="Post a role to begin" />
          <StatCard label="Applicants" value="0" hint="Across all roles" />
          <StatCard label="Shortlisted" value="0" hint="Candidates moved forward" />
          <StatCard label="Avg. response" value="—" hint="Updates with applicant activity" />
        </div>
      </div>
    </DashboardLayout>
  );
}
