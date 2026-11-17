import { Link } from 'react-router-dom';

const COLUMNS = [
  {
    heading: 'Platform',
    links: [
      { to: '/', label: 'Home' },
      { to: '/explore-talent', label: 'Explore talent' },
      { to: '/about', label: 'About' },
    ],
  },
  {
    heading: 'Get started',
    links: [
      { to: '/register', label: 'Create an account' },
      { to: '/login', label: 'Log in' },
    ],
  },
  {
    heading: 'Trust',
    links: [
      { to: '/verify', label: 'Verify a certificate' },
    ],
  },
];

export default function PublicFooter() {
  return (
    <footer className="border-t border-mist-200 bg-forest-700 text-forest-100">
      <div className="mx-auto grid max-w-shell gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-xl font-bold tracking-tight text-white">
            skill<span className="text-clay-500">chain</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-forest-100/70">
            The campus placement platform that turns verified skills, projects and certificates into real interview calls.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-forest-100/50">{column.heading}</p>
            <ul className="space-y-2.5">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-forest-100/80 hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-forest-100/50">
        © {new Date().getFullYear()} SkillChain. Built as a college mini-project.
      </div>
    </footer>
  );
}
