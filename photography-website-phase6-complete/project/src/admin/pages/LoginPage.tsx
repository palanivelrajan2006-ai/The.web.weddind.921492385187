import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Aperture, AlertCircle } from 'lucide-react';
import { useAuth } from '@/admin/lib/AuthContext';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';

export default function LoginPage() {
  const { session, signIn } = useAuth();
  const { settings } = useBusinessSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) setError(error);
  };

  const inputClass =
    'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-4 py-3 text-sm text-ink-100 placeholder-ink-400 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30 disabled:opacity-50';
  const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-300';

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Aperture className="h-10 w-10 text-gold-400" strokeWidth={1.5} />
          <h1 className="font-display text-2xl font-medium text-ink-50">{settings.studio_name}</h1>
          <p className="text-xs uppercase tracking-widest text-ink-400">Admin Sign In</p>
        </div>

        <form onSubmit={handleSubmit} className="card-surface space-y-5 p-6 sm:p-8">
          <div>
            <label className={labelClass} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              disabled={submitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@studio.com"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              disabled={submitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-70">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-400">
          Admin accounts are created in the Supabase dashboard — see README.
        </p>
      </div>
    </div>
  );
}
