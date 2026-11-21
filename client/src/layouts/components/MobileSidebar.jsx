import { Link, useNavigate } from 'react-router-dom';
import RoleNavigation from './RoleNavigation.jsx';
import { ROLE_LABELS } from '../../constants/roles.js';
import { useAuth } from '../../features/auth/useAuth.js';

export default function MobileSidebar({ role, open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  async function handleLogout() {
    onClose();
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex h-full w-72 flex-col bg-forest-600 px-5 py-7 text-white">
        <div className="mb-6 flex items-center justify-between">
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
        <div className="flex-1 overflow-y-auto">
          <RoleNavigation role={role} onNavigate={onClose} />
        </div>

        {/* User profile & visible logout action */}
        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{user?.name || 'Account'}</p>
              <p className="truncate text-[11px] text-forest-100/60">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-forest-100 hover:bg-white/15 hover:text-white transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
