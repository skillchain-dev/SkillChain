import { Link, Outlet } from 'react-router-dom';

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-forest-700 px-12 py-10 text-white lg:flex">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-white">
          skill<span className="text-clay-500">chain</span>
        </Link>
        <div className="max-w-sm">
          <p className="font-display text-3xl font-semibold leading-tight">
            Verified skills. Real opportunities. One platform for campus placements.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-forest-100/70">
            Students showcase verified projects and certificates. Recruiters find talent they can trust.
            Faculty keep the whole pipeline accountable.
          </p>
        </div>
        <p className="text-xs text-forest-100/50">© {new Date().getFullYear()} SkillChain</p>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-clay-500/20" aria-hidden="true" />
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <Link to="/" className="mb-8 font-display text-xl font-bold tracking-tight text-forest-700 lg:hidden">
          skill<span className="text-clay-500">chain</span>
        </Link>
        <div className="mx-auto w-full max-w-sm">
          {children ?? <Outlet />}
        </div>
      </div>
    </div>
  );
}
