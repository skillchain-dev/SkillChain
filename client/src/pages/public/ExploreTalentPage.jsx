import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { verificationApi } from '../../features/verification/api.js';

export default function ExploreTalentPage() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    verificationApi.directory({ search, branch, skills: selectedSkill })
      .then((data) => {
        if (active) setTalents(data || []);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load verified talent directory.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [search, branch, selectedSkill]);

  return (
    <div className="mx-auto max-w-shell px-6 py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-clay-500">Explore talent</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-forest-700 sm:text-5xl">
          Browse verified student talent.
        </h1>
        <p className="mt-3 text-base leading-relaxed text-mist-700">
          A public directory of students with faculty-approved certificates, verified skills, and project portfolios —
          searchable by recruiters without needing an account.
        </p>
      </div>

      {/* Filter and search bar */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 max-w-4xl">
        <input
          type="text"
          placeholder="Search by student or college..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-mist-300 bg-white px-3.5 py-2 text-sm text-ink focus:border-clay-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Filter by branch (e.g. CSE)..."
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="rounded-md border border-mist-300 bg-white px-3.5 py-2 text-sm text-ink focus:border-clay-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Filter by skill (e.g. React, Solidity)..."
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="rounded-md border border-mist-300 bg-white px-3.5 py-2 text-sm text-ink focus:border-clay-500 focus:outline-none"
        />
      </div>

      {error && (
        <div role="alert" className="mt-6 max-w-xl rounded-md border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-12 text-center text-sm text-mist-500 animate-pulse">
          Loading verified student profiles…
        </div>
      ) : talents.length === 0 ? (
        <div className="mt-12 rounded-card border border-mist-200 bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-forest-700">No student profiles match your search</p>
          <p className="mt-2 text-sm text-mist-600">Try adjusting your keyword, branch, or skill filters.</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setBranch(''); setSelectedSkill(''); }}
            className="mt-4 text-sm font-semibold text-clay-600 underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {talents.map((talent) => (
            <article key={talent._id} className="flex flex-col justify-between rounded-card border border-mist-200 bg-white p-6 shadow-card hover:shadow-lift transition-all">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-forest-800">{talent.name}</h2>
                    <p className="text-xs text-mist-600 mt-0.5">{talent.college}</p>
                    <p className="text-xs font-medium text-forest-700">{talent.branch} · Class of {talent.graduationYear}</p>
                  </div>
                  {talent.approvedCertificatesCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 shrink-0" title="Has faculty-approved on-chain credentials">
                      <span>✓</span> {talent.approvedCertificatesCount} Verified
                    </span>
                  )}
                </div>

                {talent.bio && (
                  <p className="mt-3 text-xs leading-relaxed text-mist-700 line-clamp-3">
                    {talent.bio}
                  </p>
                )}

                {/* Skills row */}
                <div className="mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-mist-500 mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {talent.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          skill.verified
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-mist-100 text-mist-700'
                        }`}
                      >
                        {skill.name} {skill.verified && '✓'}
                      </span>
                    ))}
                    {!talent.skills?.length && <span className="text-xs text-mist-400">No skills listed</span>}
                  </div>
                </div>

                {/* Certificates / projects count */}
                {talent.projects?.length > 0 && (
                  <div className="mt-4 border-t border-mist-100 pt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-mist-500 mb-1">Projects</p>
                    <ul className="text-xs text-forest-700 space-y-1">
                      {talent.projects.slice(0, 2).map((proj) => (
                        <li key={proj.title} className="truncate font-medium">
                          • {proj.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-mist-100 pt-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {talent.certificates?.[0] ? (
                    <Link
                      to={`/verify/${encodeURIComponent(talent.certificates[0].certificateId)}`}
                      className="text-xs font-semibold text-clay-600 hover:text-clay-700 underline"
                    >
                      Verify credentials →
                    </Link>
                  ) : (
                    <span className="text-xs text-mist-400">Profile registered</span>
                  )}
                  {talent.resumeUrl && (
                    <a
                      href={talent.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-forest-700 hover:text-forest-900 underline"
                    >
                      Resume ↗
                    </a>
                  )}
                </div>
                <Link to="/register">
                  <Button variant="secondary" className="text-xs py-1.5 px-3">
                    Contact candidate
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Recruiter Call to Action */}
      <section className="mt-16 rounded-card border border-mist-200 bg-forest-800 p-8 sm:p-10 text-white">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-clay-400">Hiring made reliable</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold">
            Want to post jobs and match with qualified students?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-forest-100 leading-relaxed">
            Create a recruiter account to post opportunities, review applicants with AI skill-match scores,
            and view complete verified student profiles.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link to="/register">
              <Button>Create recruiter account</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
                Sign in to dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
