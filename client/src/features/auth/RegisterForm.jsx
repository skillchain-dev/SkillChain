import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { runValidators, validateConfirmPassword, validateEmail, validateName, validatePassword } from '../../utils/validation.js';
import { REGISTERABLE_ROLES, ROLE_LABELS, DASHBOARD_HOME } from '../../constants/roles.js';

const ROLE_COPY = {
  student: 'Build a verified profile with your skills, projects and certificates.',
  recruiter: 'Post roles and discover candidates with verified credentials.',
};

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '', role: REGISTERABLE_ROLES[0] });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const fieldErrors = runValidators(values, {
      name: validateName,
      email: validateEmail,
      password: validatePassword,
      confirmPassword: (value) => validateConfirmPassword(values.password, value),
    });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setFormError('');
    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = values;
      const user = await register(payload);
      navigate(DASHBOARD_HOME[user.role] || '/', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Could not create your account. Please try again.');
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

      <div>
        <p className="mb-1.5 text-sm font-medium text-forest-700">I'm joining as a</p>
        <div className="grid grid-cols-2 gap-3">
          {REGISTERABLE_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setValues((current) => ({ ...current, role }))}
              aria-pressed={values.role === role}
              className={`rounded-card border p-3.5 text-left transition-colors
                ${values.role === role ? 'border-clay-500 bg-clay-50' : 'border-mist-300 bg-white hover:border-forest-500'}`}
            >
              <span className={`block text-sm font-semibold ${values.role === role ? 'text-clay-600' : 'text-forest-700'}`}>
                {ROLE_LABELS[role]}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-mist-600">{ROLE_COPY[role]}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-mist-600">
          Registering on behalf of your institution as admin or faculty? Access is provisioned by SkillChain — contact your placement cell.
        </p>
      </div>

      <Input label="Full name" autoComplete="name" value={values.name} onChange={updateField('name')} error={errors.name} placeholder="Ananya Sharma" />
      <Input label="Email" type="email" autoComplete="email" value={values.email} onChange={updateField('email')} error={errors.email} placeholder="you@college.edu" />
      <Input label="Password" type="password" autoComplete="new-password" value={values.password} onChange={updateField('password')} error={errors.password} hint={!errors.password ? 'At least 8 characters' : undefined} />
      <Input label="Confirm password" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={updateField('confirmPassword')} error={errors.confirmPassword} />

      <Button type="submit" loading={submitting} className="w-full">Create account</Button>
    </form>
  );
}
