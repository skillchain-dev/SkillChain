import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { PUBLIC_NAV } from '../../constants/navigation.js';
import { useAuth } from '../../features/auth/useAuth.js';
import { DASHBOARD_HOME } from '../../constants/roles.js';
import Button from '../../components/ui/Button.jsx';

export default function PublicNavbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-mist-200 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-shell items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-forest-700">
          skill<span className="text-clay-500">chain</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {PUBLIC_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-forest-700' : 'text-mist-700 hover:text-forest-700'}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Button to={DASHBOARD_HOME[user?.role] || '/'} variant="secondary" size="sm">
                Go to dashboard
              </Button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold text-danger-600 hover:bg-danger-50 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-forest-700 hover:text-clay-600">Log in</Link>
              <Button to="/register" size="sm">Get started</Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="rounded p-1.5 text-forest-700 hover:bg-mist-100 md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-mist-200 bg-cream px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {PUBLIC_NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setOpen(false)} className="text-sm font-medium text-forest-700">
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-mist-200 pt-4">
              {isAuthenticated ? (
                <>
                  <Button to={DASHBOARD_HOME[user?.role] || '/'} variant="secondary" className="w-full" onClick={() => setOpen(false)}>
                    Go to dashboard
                  </Button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-1.5 rounded px-3 py-2 text-sm font-semibold text-danger-600 hover:bg-danger-50 transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-semibold text-forest-700">Log in</Link>
                  <Button to="/register" className="w-full" onClick={() => setOpen(false)}>Get started</Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
