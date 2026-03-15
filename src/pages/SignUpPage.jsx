import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, ArrowRight, Mail, Lock, User, Briefcase } from 'lucide-react';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'passenger'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-blue-600"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <Plane className="h-10 w-10 text-primary-500 group-hover:rotate-12 transition-transform" />
            <span className="text-3xl font-extrabold text-white tracking-tighter">P2C</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
          <p className="mt-2 text-sm text-slate-400">Join the elite airport clearance network</p>
        </div>

        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl shadow-black/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-500/10 p-4 border border-red-500/20 text-sm text-red-500 flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block ml-1">Full Name</label>
                <div className="relative">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                   <input
                    type="text"
                    required
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-3 py-3 text-white placeholder-slate-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block ml-1">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                   <input
                    type="email"
                    required
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-3 py-3 text-white placeholder-slate-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block ml-1">Password</label>
                <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                   <input
                    type="password"
                    required
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-3 py-3 text-white placeholder-slate-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block ml-1">Join as a...</label>
                <div className="relative">
                   <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                   <select
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-10 py-3 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="passenger">Passenger - For stress-free travel</option>
                    <option value="concierge">Concierge - Join our verified fleet</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col items-center gap-4">
             <p className="text-center text-sm text-slate-400">
              Already a member?{' '}
              <Link to="/login" className="font-bold text-primary-400 hover:text-primary-300 transition-colors">
                Sign in
              </Link>
            </p>
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest font-bold">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
