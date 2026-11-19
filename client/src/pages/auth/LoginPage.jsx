import { Link } from 'react-router-dom';
import LoginForm from '../../features/auth/LoginForm.jsx';

export default function LoginPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-700">Welcome back</h1>
      <p className="mt-1.5 text-sm text-mist-600">Log in to continue to your SkillChain dashboard.</p>
      <div className="mt-7">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-mist-600">
        <Link to="/forgot-password" className="font-medium text-forest-700 hover:text-clay-600">Forgot your password?</Link>
      </p>
      <p className="mt-3 text-center text-sm text-mist-600">
        New to SkillChain? <Link to="/register" className="font-semibold text-clay-600 hover:text-clay-500">Create an account</Link>
      </p>
    </div>
  );
}
