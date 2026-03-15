import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Services', href: '/#services' },
    { name: 'Guide', href: '/#guide' },
    { name: 'About Us', href: '/#about' },
  ];

  const handleNavClick = (href) => {
    setIsOpen(false);
    if (href.startsWith('/#') && location.pathname === '/') {
      const id = href.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Plane className="h-8 w-8 text-primary-500 group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-extrabold text-white tracking-tighter">P2C</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {location.pathname === '/' && navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-bold text-slate-300 hover:text-primary-400 transition-colors uppercase tracking-widest"
              >
                {link.name}
              </button>
            ))}
            
            {user ? (
              <div className="flex items-center gap-6 pl-6 border-l border-slate-800">
                <div className="flex items-center gap-2 text-slate-300 text-sm bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-white hover:text-primary-400 transition-colors uppercase tracking-widest">
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-900 border-b border-slate-800 p-8 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-8 items-center text-center">
            {location.pathname === '/' && navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-lg font-bold text-slate-300 hover:text-primary-400 uppercase tracking-widest"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-8 border-t border-slate-800 flex flex-col gap-6 w-full items-center">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-slate-300 font-medium bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
                    <User className="h-5 w-5" />
                    <span>{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-widest text-sm hover:text-red-300 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-bold text-white uppercase tracking-widest hover:text-primary-400 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setIsOpen(false)}
                    className="w-full max-w-xs bg-primary-600 text-white text-center py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary-600/20"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
