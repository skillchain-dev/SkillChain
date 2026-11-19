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
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 hover:bg-mist-100"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-100 text-xs font-bold text-forest-600">
            {initials}
          </span>
          <span className="hidden text-sm font-medium text-ink sm:inline">{user?.name || 'Account'}</span>
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden="true" />
            <div className="absolute right-0 z-20 mt-2 w-48 rounded-card border border-mist-200 bg-white py-1.5 shadow-lift">
              <p className="truncate px-3.5 py-1.5 text-xs text-mist-600">{user?.email}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full px-3.5 py-2 text-left text-sm font-medium text-danger-600 hover:bg-danger-50"
              >
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
