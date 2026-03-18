import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, ArrowRight, Mail, Lock, User, CheckCircle } from 'lucide-react';

export default function SignUpPage() {
  // Role is always 'passenger' — concierges are added by admin only
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'passenger' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    try {
      const userData = await register(formData);
      if (userData && localStorage.getItem('token')) {
        navigate('/dashboard');
      } else {
        setRegistered(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FIELD_CLASS = 'block w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all';

  if (registered) {
    return (
      <div className="min-h-screen bg-[#020817] bg-grid flex items-center justify-center px-4 py-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-[100px]" />
        </div>
        <div className="relative w-full max-w-md text-center">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl p-10 backdrop-blur-sm">
            <div className="flex justify-center mb-5">
              <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-3">Check your email</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-2">
              We sent a confirmation link to
            </p>
            <p className="text-primary-400 font-semibold text-sm mb-5">{formData.email}</p>
            <p className="text-slate-500 text-xs leading-relaxed mb-8">
              Click the link in the email to confirm your account, then come back to sign in. Check your spam folder if you don't see it.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-primary-600 hover:bg-primary-500 px-4 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-primary-600/20"
            >
              Go to Sign In <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] bg-grid flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-[100px]" />
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
          <h1 className="text-3xl font-extrabold text-white mb-2">Create your account</h1>
          <p className="text-slate-500 text-sm">Join Nigeria's elite airport concierge network</p>
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

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                <input
                  type="text"
                  required
                  placeholder="John Adebayo"
                  className={FIELD_CLASS}
                  value={formData.full_name}
                  onChange={handleChange('full_name')}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className={FIELD_CLASS}
                  value={formData.email}
                  onChange={handleChange('email')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  className={FIELD_CLASS}
                  value={formData.password}
                  onChange={handleChange('password')}
                />
              </div>
            </div>


            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98]"
            >
              {isSubmitting ? 'Creating account…' : 'Create Account'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary-400 hover:text-primary-300 transition-colors">
                Sign in
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
