import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { validateEmail } from '../../utils/validation.js';
import httpClient from '../../services/httpClient.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateEmail(email);
    setError(validationError);
    if (validationError) return;

    setSubmitting(true);
    try {
      await httpClient.post('/auth/forgot-password', { email });
    } catch {
      // Regardless of whether the account exists or the endpoint is wired up yet,
      // we never reveal account existence — the confirmation message is the same either way.
    } finally {
      setSubmitting(false);
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest-700">Check your inbox</h1>
        <p className="mt-2 text-sm leading-relaxed text-mist-600">
          If an account exists for <span className="font-medium text-ink">{email}</span>, we've sent a link to reset your password.
        </p>
        <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-clay-600 hover:text-clay-500">Back to log in</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-700">Reset your password</h1>
      <p className="mt-1.5 text-sm text-mist-600">Enter your email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} error={error} placeholder="you@college.edu" />
        <Button type="submit" loading={submitting} className="w-full">Send reset link</Button>
      </form>
      <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-forest-700 hover:text-clay-600">Back to log in</Link>
    </div>
  );
}
