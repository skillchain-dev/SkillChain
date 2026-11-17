import { AuthProvider } from '../features/auth/authStore.jsx';
import ErrorBoundary from '../components/common/ErrorBoundary.jsx';

// Single place to stack app-wide providers/boundaries so main.jsx / App.jsx stay simple.
export default function AppProviders({ children }) {
  return (
    <ErrorBoundary>
      <AuthProvider>{children}</AuthProvider>
    </ErrorBoundary>
  );
}
