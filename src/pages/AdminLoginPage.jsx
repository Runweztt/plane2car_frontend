import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, ArrowRight, Mail, Lock } from 'lucide-react';
import api from '../api/axios';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/admin-login', { email, password });
      const { access_token, user: userData } = response.data;
      loginWithToken(access_token, userData);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const FIELD_CLASS = 'block w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all';

  return (
    <div className="min-h-screen bg-[#020817] bg-grid flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-red-600/6 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
            <Shield className="h-7 w-7 text-red-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Admin Access</h1>
          <p className="text-slate-500 text-sm">Restricted to authorized administrators only</p>
        </div>

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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  className={FIELD_CLASS}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Password</label>
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
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]"
            >
              {loading ? 'Signing in…' : 'Sign In as Admin'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-700">
          This portal is monitored. Unauthorized access attempts are logged.
        </p>
      </div>
    </div>
  );
}
