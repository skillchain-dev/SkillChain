import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { runValidators, validateEmail, validatePassword } from '../../utils/validation.js';
import { DASHBOARD_HOME } from '../../constants/roles.js';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const fieldErrors = runValidators(values, { email: validateEmail, password: validatePassword });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setFormError('');
    setSubmitting(true);
    try {
      const user = await login(values);
      const redirectTo = location.state?.from?.pathname || DASHBOARD_HOME[user.role] || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Could not sign in. Check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError && (
        <p role="alert" className="rounded border border-danger-500/30 bg-danger-50 px-3.5 py-2.5 text-sm font-medium text-danger-600">
          {formError}
        </p>
      )}
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={updateField('email')}
        error={errors.email}
        placeholder="you@college.edu"
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        value={values.password}
        onChange={updateField('password')}
        error={errors.password}
        placeholder="••••••••"
      />
      <Button type="submit" loading={submitting} className="w-full">Log in</Button>
    </form>
  );
}
