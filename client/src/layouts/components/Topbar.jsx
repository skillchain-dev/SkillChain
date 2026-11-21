import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth.js';
import { ROLE_LABELS } from '../../constants/roles.js';

export default function Topbar({ role, onMenuClick, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const initials = (user?.name || ROLE_LABELS[role] || '?').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-mist-200 bg-white/80 px-5 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded p-1.5 text-forest-700 hover:bg-mist-100 lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <span className="text-sm font-medium text-mist-700">{title || `${ROLE_LABELS[role] || ''} dashboard`}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 hover:bg-mist-100 transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-100 text-xs font-bold text-forest-600">
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-ink sm:inline">{user?.name || 'Account'}</span>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden="true" />
              <div className="absolute right-0 z-20 mt-2 w-52 rounded-card border border-mist-200 bg-white py-2 shadow-lift">
                <div className="border-b border-mist-100 px-3.5 pb-2">
                  <p className="truncate text-xs font-semibold text-ink">{user?.name}</p>
                  <p className="truncate text-xs text-mist-500">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm font-medium text-danger-600 hover:bg-danger-50 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Log out</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Direct, prominent logout button on desktop */}
        <button
          type="button"
          onClick={handleLogout}
          title="Log out of your account"
          className="hidden sm:flex items-center gap-1.5 rounded-md border border-mist-200 bg-white px-3 py-1.5 text-xs font-semibold text-mist-700 hover:border-danger-300 hover:bg-danger-50 hover:text-danger-600 transition-colors shadow-xs"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Log out</span>
        </button>
      </div>
    </header>
  );
}
