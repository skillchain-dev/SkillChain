import { Link } from 'react-router-dom';
import RoleNavigation from './RoleNavigation.jsx';
import { ROLE_LABELS } from '../../constants/roles.js';

export default function MobileSidebar({ role, open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex h-full w-72 flex-col bg-forest-600 px-5 py-7 text-white">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" onClick={onClose} className="font-display text-xl font-bold tracking-tight text-white">
            skill<span className="text-clay-500">chain</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded p-1.5 text-forest-100/80 hover:bg-white/10 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-forest-100/60">
          {ROLE_LABELS[role] || role} workspace
        </p>
        <RoleNavigation role={role} onNavigate={onClose} />
      </div>
    </div>
  );
}
