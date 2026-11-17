import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-shell px-6 py-16 sm:py-24">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-clay-500">About SkillChain</p>
      <h1 className="max-w-2xl font-display text-4xl font-semibold tracking-tight text-forest-700 sm:text-5xl">
        Placement season shouldn't run on trust me, I did this.
      </h1>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <p className="text-base leading-relaxed text-mist-700">
          SkillChain started as a college mini-project with a simple observation: recruiters can't tell a verified
          certificate from a claimed one, and students redo the same profile on every job site. So we built one
          place where a certificate is checked once by faculty, and stays checkable by anyone with the link —
          backed by a blockchain record that can't be quietly edited later.
        </p>
        <p className="text-base leading-relaxed text-mist-700">
          Students keep one profile with their skills, projects, resume and certificates. Recruiters post roles and
          see candidates ranked by real overlap with the role, not by who used the right keywords. Faculty get a
          console to approve certificates and moderate job posts, so the whole pipeline stays accountable.
        </p>
      </div>
      <div className="mt-14 rounded-card border border-mist-200 bg-white p-8">
        <h2 className="font-display text-xl font-semibold text-forest-700">Built by a five-person team</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist-600">
          The frontend foundation — navigation, authentication and the role-based dashboards you're using right
          now — is one part of a larger system that includes job matching, resume parsing, certificate verification
          and blockchain-backed credentials, each owned by a different member of the team.
        </p>
      </div>
      <div className="mt-10">
        <Link to="/register"><Button>Create your account</Button></Link>
      </div>
    </div>
  );
}
