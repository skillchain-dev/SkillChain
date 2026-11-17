import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth.js';
import { DASHBOARD_HOME } from '../constants/roles.js';
import ProtectedRoute from './ProtectedRoute.jsx';

// Layers role-based access on top of ProtectedRoute: signed-in users with the wrong
// role are bounced to their own dashboard rather than seeing a 403 or someone else's data.
export default function RoleRoute({ allow = [], children }) {
  return (
    <ProtectedRoute>
      <RoleCheck allow={allow}>{children}</RoleCheck>
    </ProtectedRoute>
  );
}

function RoleCheck({ allow, children }) {
  const { user } = useAuth();
  if (allow.length && !allow.includes(user?.role)) {
    return <Navigate to={DASHBOARD_HOME[user?.role] || '/'} replace />;
  }
  return children;
}
