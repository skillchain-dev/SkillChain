import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import MobileSidebar from './components/MobileSidebar.jsx';
import Topbar from './components/Topbar.jsx';

// Two ways to use this layout:
//  1. Wrap a page directly:      <DashboardLayout role="student"><JobDiscoveryPage/></DashboardLayout>
//  2. As a nested route layout:  <Route element={<DashboardLayout role="admin" />}>...child routes...</Route>
// When no children are passed it renders an <Outlet/>, so both patterns share one implementation.
export default function DashboardLayout({ children, role, title }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar role={role} />
      <MobileSidebar role={role} open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar role={role} title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
