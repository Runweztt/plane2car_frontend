import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Zap, Shield, Clock, MapPin, CheckCircle2, Star, Users, ArrowRight, Instagram, Twitter, Facebook } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-slate-900 text-white selection:bg-primary-500/30">
      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-1/4 w-72 h-72 md:w-96 md:h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-72 h-72 md:w-96 md:h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl text-center md:text-left mx-auto md:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs md:text-sm font-medium mb-8 animate-bounce">
              <Zap className="h-4 w-4" />
              <span>Fastest Airport Clearance in Nigeria</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Arrive in Nigeria <br className="hidden md:block" />
              <span className="text-primary-500">Without the Stress</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
              Priority Passenger Clearance (P2C) provides premium airport concierge services across major Nigerian airports. From the gate to your car, we handle the friction so you don't have to.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-4 text-base md:text-lg font-bold text-white hover:bg-primary-500 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary-600/20"
              >
                Get Started Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 px-8 py-4 text-base md:text-lg font-bold text-white hover:bg-slate-700 transition-all active:scale-95"
              >
                View Services
              </a>
            </div>
            
            <div className="mt-20 flex flex-wrap items-center justify-center md:justify-start gap-8 border-t border-slate-800 pt-10 grayscale opacity-50">
               <div className="flex items-center gap-2">
                 <Shield className="h-5 w-5" />
                 <span className="font-bold text-[10px] md:text-xs tracking-widest uppercase">Verified Service</span>
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="h-5 w-5" />
                 <span className="font-bold text-[10px] md:text-xs tracking-widest uppercase">Trusted Partner</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-primary-500 uppercase mb-3">Our Services</h2>
            <p className="text-4xl font-bold text-white mb-4">Elite Travel Support</p>
            <p className="text-slate-400 max-w-2xl mx-auto">We've tailored our tiers to match your needs, whether you're a first-time visitor or a frequent flyer.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Economy Fast-Track',
                price: '50',
                features: ['Expedited Immigration', 'Hand Luggage Assistance', 'Gate Arrival Meetup'],
                color: 'blue'
              },
              {
                title: 'Premium Concierge',
                price: '100',
                features: ['Immigration & Customs Priority', 'Full Baggage Handling', 'Escort to Arrival Hall', 'Secure Pickup Coordination'],
                recommended: true
              },
              {
                title: 'VIP Luxury',
                price: '200',
                features: ['VIP Lounge Access', 'Discreet Executive Clearance', 'Luxury Vehicle Escort', 'Armed Escort Available (Add-on)'],
                color: 'purple'
              }
            ].map((tier, idx) => (
              <div key={idx} className={`relative p-6 md:p-8 rounded-3xl border ${tier.recommended ? 'bg-slate-800 border-primary-500/50 shadow-2xl shadow-primary-500/10' : 'bg-slate-800/50 border-slate-700'} hover:border-primary-500/30 transition-all group`}>
                {tier.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl md:text-2xl font-bold mb-2">{tier.title}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-2xl md:text-3xl font-bold font-mono">${tier.price}</span>
                  <span className="text-slate-400 text-sm">/booking</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-primary-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block w-full text-center py-3 rounded-xl font-bold transition-all text-sm ${tier.recommended ? 'bg-primary-600 text-white hover:bg-primary-500' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                >
                  Choose {tier.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide / How it Works Section */}
      <section id="guide" className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-sm font-bold tracking-widest text-primary-500 uppercase mb-3">The Experience</h2>
              <p className="text-4xl font-bold text-white mb-8">How P2C Works</p>
              
              <div className="space-y-12">
                {[
                  { step: '01', title: 'Book Online', desc: 'Secure your arrival clearance at least 24 hours before your flight touches down.' },
                  { step: '02', title: 'Meet your Concierge', desc: 'A verified professional meets you at the gate with a personalized greeting.' },
                  { step: '03', title: 'Bypass the Chaos', desc: 'Glide through immigration and customs while your concierge handles the details.' },
                  { step: '04', title: 'Safe Transit', desc: 'We escort you directly to your verified chauffeur or designated pickup point.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 md:gap-6 group">
                    <span className="text-3xl md:text-5xl font-extrabold text-slate-800 transition-colors group-hover:text-primary-500/20">{item.step}</span>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{item.title}</h4>
                      <p className="text-sm md:text-base text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full max-w-md">
                <div className="aspect-[4/5] rounded-3xl bg-slate-800 border border-slate-700 p-8 flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Plane className="h-16 w-16 text-primary-500 mb-6 mx-auto" />
                  <div className="space-y-4 relative z-10">
                     <div className="h-3 w-3/4 bg-slate-700 rounded-full"></div>
                     <div className="h-3 w-full bg-slate-700 rounded-full"></div>
                     <div className="h-3 w-1/2 bg-slate-700 rounded-full"></div>
                  </div>
                  <div className="mt-8 p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-center relative z-10">
                    <p className="text-sm text-slate-300 italic">"P2C turned a 2-hour queue into a 5-minute breeze. Absolutely essential for arrival in Lagos."</p>
                    <p className="mt-3 text-xs font-bold text-primary-400 uppercase">- John D., CEO</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-slate-800/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square bg-slate-700 rounded-2xl animate-pulse"></div>
                <div className="aspect-video bg-slate-800 rounded-2xl"></div>
              </div>
              <div className="pt-8 space-y-4">
                <div className="aspect-video bg-slate-800 rounded-2xl"></div>
                <div className="aspect-square bg-primary-600/20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-500">99%</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-widest text-primary-500 uppercase mb-3">Our Mission</h2>
              <p className="text-4xl font-bold text-white mb-6">Restoring Trust in Nigerian Airport Logistics</p>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Founded by a team of frequent travelers and logistics experts, P2C was born out of a simple realization: the first hour in a new country defines your entire experience.
              </p>
              <p className="text-slate-300 mb-8 leading-relaxed">
                In Nigeria, airport navigation can be complex. We provide a structured, verified, and professional bridge between the plane and your destination.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-2xl font-bold text-white">4+</h4>
                  <p className="text-sm text-slate-500">Major Airports</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white">50+</h4>
                  <p className="text-sm text-slate-500">Verified Concierges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center md:text-left">
            <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-6">
                <Plane className="h-8 w-8 text-primary-500" />
                <span className="text-2xl font-extrabold text-white tracking-tight">P2C</span>
              </div>
              <p className="text-slate-400 max-w-xs mb-8 mx-auto md:mx-0">
                Your luxury gateway to Nigeria. Stress-free, secure, and professional airport clearance.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="#" className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:text-primary-500 transition-colors shadow-lg"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:text-primary-500 transition-colors shadow-lg"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:text-primary-500 transition-colors shadow-lg"><Facebook className="h-5 w-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><a href="#home" className="hover:text-primary-400 transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-primary-400 transition-colors">Services</a></li>
                <li><a href="#about" className="hover:text-primary-400 transition-colors">About Us</a></li>
                <li><a href="#guide" className="hover:text-primary-400 transition-colors">User Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Support</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><a href="#" className="hover:text-primary-400 transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Airport Partners</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-8 text-center">
            <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">
              &copy; 2026 Priority Passenger Clearance. Built for Excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
