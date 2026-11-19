import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl font-semibold text-clay-500">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-forest-700">This page wandered off</h1>
      <p className="mt-2 max-w-sm text-sm text-mist-600">The page you're looking for doesn't exist, or may have moved.</p>
      <Link to="/" className="mt-7"><Button>Back to home</Button></Link>
    </div>
  );
}
