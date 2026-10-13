import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { MarigoldMark } from '../components/Pattern.jsx';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-maroon px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-cream p-8" aria-label="Staff sign in">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <MarigoldMark className="h-12 w-12" />
          <h1 className="font-display text-2xl font-semibold">Staff sign in</h1>
        </div>
        {error && <p role="alert" className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p>}
        <label htmlFor="a-email" className="label">Email</label>
        <input id="a-email" type="email" required autoComplete="username" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="a-pass" className="label mt-4">Password</label>
        <input id="a-pass" type="password" required autoComplete="current-password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={busy} className="btn-maroon mt-6 w-full">{busy ? 'Signing in…' : 'Sign in'}</button>
        <Link to="/" className="mt-4 block text-center text-sm text-maroon underline underline-offset-4">Back to website</Link>
      </form>
    </div>
  );
}
