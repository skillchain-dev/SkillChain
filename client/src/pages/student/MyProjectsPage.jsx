import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function MyProjectsPage() {
  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Projects" title="Your projects" description="Showcase projects with descriptions, links and the skills each one demonstrates." />
        <EmptyState
          title="This section is still being built"
          description="This page is wired into navigation and routing, ready for the team member owning this feature to fill in."
        />
      </div>
    </DashboardLayout>
  );
}
