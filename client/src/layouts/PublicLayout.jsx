import { Outlet } from 'react-router-dom';
import PublicNavbar from './components/PublicNavbar.jsx';
import PublicFooter from './components/PublicFooter.jsx';

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <PublicNavbar />
      <main className="flex-1">{children ?? <Outlet />}</main>
      <PublicFooter />
    </div>
  );
}
