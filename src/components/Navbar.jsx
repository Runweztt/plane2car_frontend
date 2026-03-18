import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, LogOut, User, Menu, X, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home',     href: '/#home' },
  { name: 'Services', href: '/#services' },
  { name: 'Guide',    href: '/#guide' },
  { name: 'About',    href: '/#about' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleNavClick = (href) => {
    setIsOpen(false);
    if (href.startsWith('/#') && location.pathname === '/') {
      document.getElementById(href.split('#')[1])?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(href);
    }
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-[#020817]/95 backdrop-blur-lg border-b border-slate-800/80 shadow-xl shadow-black/20'
          : 'bg-transparent'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between" style={{ height: '72px' }}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="h-9 w-9 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center group-hover:border-primary-500/40 transition-all">
                <Plane className="h-4.5 w-4.5 text-primary-400 group-hover:rotate-12 transition-transform" style={{ height: '18px', width: '18px' }} />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">P2C</span>
            </Link>

            {/* Desktop center nav — only on home */}
            {isHome && (
              <div className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map(l => (
                  <button
                    key={l.name}
                    onClick={() => handleNavClick(l.href)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            )}

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-sm">
                    <div className="h-6 w-6 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 text-xs font-bold">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                    <span className="max-w-[140px] truncate text-xs font-medium">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign out"
                    className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-sm font-bold text-white transition-all shadow-lg shadow-primary-600/20"
                  >
                    Get Started
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(o => !o)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          {/* Panel */}
          <div className="absolute top-[72px] left-0 right-0 bg-[#0a1628] border-b border-slate-800 p-6 shadow-2xl">
            <div className="space-y-1 mb-6">
              {isHome && NAV_LINKS.map(l => (
                <button
                  key={l.name}
                  onClick={() => handleNavClick(l.href)}
                  className="w-full text-left px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium transition-all"
                >
                  {l.name}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-5 space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700">
                    <div className="h-8 w-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold text-sm">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm text-slate-300 truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-semibold transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-3 rounded-xl border border-slate-700 text-white font-semibold hover:bg-slate-800 transition-all"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-center px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold transition-all shadow-lg shadow-primary-600/20"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
