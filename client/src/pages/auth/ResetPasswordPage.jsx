import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import httpClient from '../../services/httpClient.js';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const token = searchParams.get('token') || '';

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (password.length < 8 || new TextEncoder().encode(password).length > 72) {
      setError('Password must be between 8 and 72 bytes.');
      return;
    }
    if (password !== confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await httpClient.post('/auth/reset-password', { token, password });
      setComplete(true);
    } catch (requestError) {
      setError(requestError.message || 'This reset link is invalid or expired.');
    } finally {
      setSubmitting(false);
    }
  }

  if (complete) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest-700">Password updated</h1>
        <p className="mt-2 text-sm text-mist-600">You can now sign in with your new password.</p>
        <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-forest-700">Back to log in</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-700">Choose a new password</h1>
      <form onSubmit={submit} noValidate className="mt-7 space-y-5">
        {!token && <p role="alert" className="text-sm text-danger-600">This reset link is invalid or expired.</p>}
        {error && <p role="alert" className="text-sm text-danger-600">{error}</p>}
        <Input label="New password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <Input label="Confirm new password" type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
        <Button type="submit" loading={submitting} disabled={!token} className="w-full">Update password</Button>
      </form>
    </div>
  );
}
