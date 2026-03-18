import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, ArrowRight, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'passenger') navigate('/dashboard');
      else if (user.role === 'concierge') navigate('/concierge');
      else if (user.role === 'admin') navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FIELD_CLASS = 'block w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all';

  return (
    <div className="min-h-screen bg-[#020817] bg-grid flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center group-hover:border-primary-500/40 transition-all">
              <Plane className="h-5 w-5 text-primary-400 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">P2C</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm">Sign in to manage your airport concierge bookings</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-red-500/8 border border-red-500/20 p-4 text-sm text-red-400">
                <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold">!</span>
                </div>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className={FIELD_CLASS}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className={FIELD_CLASS}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98]"
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-primary-400 hover:text-primary-300 transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
