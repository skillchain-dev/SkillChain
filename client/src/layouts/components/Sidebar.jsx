import { Link, useNavigate } from 'react-router-dom';
import RoleNavigation from './RoleNavigation.jsx';
import { ROLE_LABELS } from '../../constants/roles.js';
import { useAuth } from '../../features/auth/useAuth.js';

export default function Sidebar({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-forest-600 px-5 py-7 text-white lg:flex">
      <Link to="/" className="font-display text-xl font-bold tracking-tight text-white">
        skill<span className="text-clay-500">chain</span>
      </Link>
      <p className="mb-6 mt-1 text-xs font-semibold uppercase tracking-widest text-forest-100/60">
        {ROLE_LABELS[role] || role} workspace
      </p>
      <div className="flex-1 overflow-y-auto">
        <RoleNavigation role={role} />
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
            title="Log out of your account"
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
    </aside>
  );
}
