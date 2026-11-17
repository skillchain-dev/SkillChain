import { Link } from 'react-router-dom';
import RegisterForm from '../../features/auth/RegisterForm.jsx';

export default function RegisterPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-700">Create your account</h1>
      <p className="mt-1.5 text-sm text-mist-600">Join as a student or recruiter — it takes less than a minute.</p>
      <div className="mt-7">
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-sm text-mist-600">
        Already have an account? <Link to="/login" className="font-semibold text-clay-600 hover:text-clay-500">Log in</Link>
      </p>
    </div>
  );
}
