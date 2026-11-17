import { Link } from 'react-router-dom';
import RoleNavigation from './RoleNavigation.jsx';
import { ROLE_LABELS } from '../../constants/roles.js';

export default function Sidebar({ role }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-forest-600 px-5 py-7 text-white lg:flex">
      <Link to="/" className="font-display text-xl font-bold tracking-tight text-white">
        skill<span className="text-clay-500">chain</span>
      </Link>
      <p className="mb-8 mt-1 text-xs font-semibold uppercase tracking-widest text-forest-100/60">
        {ROLE_LABELS[role] || role} workspace
      </p>
      <RoleNavigation role={role} />
      <div className="mt-auto pt-6 text-xs leading-relaxed text-forest-100/50">
        Verified skills, real opportunities.
      </div>
    </aside>
  );
}
