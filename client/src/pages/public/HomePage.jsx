import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';

const FEATURES = [
  {
    title: 'Verified certificates',
    description: 'Upload a certificate once. Faculty review it, and it carries a blockchain-backed proof that recruiters can check in seconds.',
    icon: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z',
  },
  {
    title: 'Skill-matched job feed',
    description: "Jobs are ranked against a student's verified skills and projects, not just keywords in a resume.",
    icon: 'M12 3l1.6 4.8L18 9.4l-4.4 1.6L12 16l-1.6-5L6 9.4l4.4-1.6L12 3z',
  },
  {
    title: 'One shareable profile',
    description: 'Projects, resume, skills and certificates live on a single public profile link recruiters can open without an account.',
    icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c1.6-3.6 4.8-6 8-6s6.4 2.4 8 6',
  },
  {
    title: 'Faculty oversight',
    description: 'Admins and faculty approve certificates, moderate job posts, and keep an eye on placement activity from one console.',
    icon: 'M4 6h6l2 2h8v10H4z',
  },
];

const STEPS = [
  { step: '1', title: 'Build a verified profile', description: 'Students add skills, projects and certificates. Faculty review and approve each certificate before it goes live.' },
  { step: '2', title: 'Recruiters post roles', description: 'Recruiters describe the role and required skills once — SkillChain surfaces it to the students who actually match.' },
  { step: '3', title: 'Apply and track', description: 'Students apply in a click and follow every application status. Recruiters move candidates through review from the same table.' },
];

const STUDENT_BENEFITS = [
  'Certificates verified once, trusted everywhere',
  'A single public profile link for every application',
  'Job matches ranked by your actual skills',
  'Application status tracked in one place',
];

const RECRUITER_BENEFITS = [
  'Candidates arrive with verified, not self-reported, credentials',
  'Filter by skill, project history and certificate status',
  'One dashboard for every open role and applicant',
  'Cut down on resume screening time',
];

function SectionEyebrow({ children }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-clay-500">{children}</p>;
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-shell px-6 pb-20 pt-16 sm:pt-24">
        <div className="max-w-2xl">
          <SectionEyebrow>Student & placement platform</SectionEyebrow>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-forest-700 sm:text-6xl">
            Placements built on skills you can prove, not just claim.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-mist-700 sm:text-lg">
            SkillChain gives students a verified profile of projects, skills and certificates, and gives recruiters a
            way to find candidates without sifting through unverifiable resumes.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/register"><Button size="lg">Create your profile</Button></Link>
            <Link to="/explore-talent"><Button size="lg" variant="outline">Explore talent</Button></Link>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-6 border-t border-mist-200 pt-10 sm:grid-cols-4">
          {[
            ['3', 'roles, one platform'],
            ['100%', 'faculty-reviewed certificates'],
            ['1', 'click to apply'],
            ['0', 'resume black holes'],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="font-display text-3xl font-semibold text-forest-700">{value}</dt>
              <dd className="mt-1 text-sm text-mist-600">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Features */}
      <section className="border-t border-mist-200 bg-white py-20">
        <div className="mx-auto max-w-shell px-6">
          <SectionEyebrow>What's inside</SectionEyebrow>
          <h2 className="max-w-xl font-display text-3xl font-semibold text-forest-700">
            Everything a placement season needs, in one place.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-card border border-mist-200 p-6">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="mb-4 text-clay-500" aria-hidden="true">
                  <path d={feature.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="font-display text-lg font-semibold text-forest-700">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-shell px-6">
          <SectionEyebrow>How it works</SectionEyebrow>
          <h2 className="max-w-xl font-display text-3xl font-semibold text-forest-700">
            From sign-up to shortlisted, in three steps.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step}>
                <span className="font-display text-4xl font-semibold text-clay-500">{item.step}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-forest-700">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-mist-200 bg-forest-700 py-20 text-white">
        <div className="mx-auto grid max-w-shell gap-10 px-6 md:grid-cols-2">
          <div className="rounded-card border border-white/10 bg-white/5 p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-clay-500">For students</p>
            <h3 className="mt-2 font-display text-2xl font-semibold">Show up to interviews already trusted.</h3>
            <ul className="mt-6 space-y-3">
              {STUDENT_BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-forest-100/85">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-clay-500" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="mt-6 inline-block text-sm font-semibold text-clay-500 hover:text-clay-100">
              Create your student profile →
            </Link>
          </div>
          <div className="rounded-card border border-white/10 bg-white/5 p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-clay-500">For recruiters</p>
            <h3 className="mt-2 font-display text-2xl font-semibold">Hire from a shortlist you can trust.</h3>
            <ul className="mt-6 space-y-3">
              {RECRUITER_BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-forest-100/85">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-clay-500" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="mt-6 inline-block text-sm font-semibold text-clay-500 hover:text-clay-100">
              Post your first role →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-shell px-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-forest-700 sm:text-4xl">Ready to get started?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-mist-600">
            It takes less than a minute to create an account — student or recruiter.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link to="/register"><Button size="lg">Get started</Button></Link>
            <Link to="/about"><Button size="lg" variant="ghost">Learn more</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
