import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function ExploreTalentPage() {
  return (
    <div className="mx-auto max-w-shell px-6 py-16 sm:py-24">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-clay-500">Explore talent</p>
      <h1 className="max-w-2xl font-display text-4xl font-semibold tracking-tight text-forest-700 sm:text-5xl">
        Browse verified student profiles.
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-mist-700">
        A public directory of students with faculty-approved certificates, verified skills and project portfolios —
        searchable by recruiters without needing an account.
      </p>

      <div className="mt-12">
        <EmptyState
          title="This directory is being wired up"
          description="The public talent directory reads from the profile and verification services the rest of the team is building. In the meantime, recruiters can create an account to search candidates from the dashboard."
          action={<Link to="/register"><Button>Create a recruiter account</Button></Link>}
        />
      </div>
    </div>
  );
}
