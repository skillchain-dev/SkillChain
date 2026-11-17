import { NavLink } from 'react-router-dom';
import { ROLE_NAV } from '../../constants/navigation.js';

const ICONS = {
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4.35-4.35',
  inbox: 'M4 4h16l-1.5 10h-13L4 4zM9 14a3 3 0 006 0',
  sparkles: 'M12 3l1.6 4.8L18 9.4l-4.4 1.6L12 16l-1.6-5L6 9.4l4.4-1.6L12 3z',
  folder: 'M4 6h6l2 2h8v10H4z',
  shield: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z',
  file: 'M6 3h8l5 5v13H6zM14 3v5h5',
  chart: 'M5 20V10M12 20V4M19 20v-7',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c1.6-3.6 4.8-6 8-6s6.4 2.4 8 6',
  plus: 'M12 5v14M5 12h14',
  users: 'M9 12a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM3 20c1.2-3 3.5-5 6-5s4.8 2 6 5M16.5 8.5A3 3 0 1116.5 4M21 20c-.7-2-2-3.5-3.5-4.4',
  building: 'M5 21V5l7-2 7 2v16M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01',
  briefcase: 'M4 8h16v11H4zM9 8V6a2 2 0 012-2h2a2 2 0 012 2v2',
};

function Icon({ name }) {
  const path = ICONS[name] || ICONS.grid;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d={path} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function RoleNavigation({ role, onNavigate }) {
  const links = ROLE_NAV[role] || [];
  return (
    <nav className="flex flex-1 flex-col gap-0.5">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={onNavigate}
          className={({ isActive }) => `flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors
            ${isActive ? 'bg-white/10 text-white' : 'text-forest-100/80 hover:bg-white/5 hover:text-white'}`}
        >
          <Icon name={link.icon} />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
