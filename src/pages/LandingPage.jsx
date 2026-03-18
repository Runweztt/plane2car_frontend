import React from 'react';
import { Link } from 'react-router-dom';
import {
  Plane, Zap, Shield, Clock, CheckCircle2, ArrowRight,
  Star, Users, MapPin, ChevronRight, Instagram, Twitter, Facebook,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TIERS = [
  {
    name: 'e-Visa & Visa on Arrival',
    price: '75',
    desc: 'We guide you through obtaining your Nigerian visa on arrival — fast, stress-free, and guaranteed.',
    features: ['Pre-arrival Document Checklist', 'Visa on Arrival Processing Support', 'Dedicated Immigration Guide', 'Priority Desk Access'],
    note: 'We do not issue visas. We guide you to obtain yours as quickly as possible.',
  },
  {
    name: 'Premium Concierge',
    price: '100',
    desc: 'Full-service concierge from gate to exit.',
    features: ['Immigration & Customs Priority', 'Full Baggage Handling', 'Arrival Hall Escort', 'Pickup Coordination'],
    popular: true,
  },
  {
    name: 'VIP Luxury',
    price: '200',
    desc: 'Discreet executive concierge with no compromise.',
    features: ['VIP Lounge Access', 'Executive Concierge', 'Luxury Vehicle Escort', 'Armed Escort (Add-on)'],
  },
];

const STEPS = [
  { n: '01', title: 'Book Online', body: 'Secure your concierge at least 24 hours before your flight touches down.' },
  { n: '02', title: 'Meet Your Concierge', body: 'A verified professional greets you at the gate with a personalized sign.' },
  { n: '03', title: 'Bypass the Chaos', body: 'Glide through immigration and customs while your concierge handles every detail.' },
  { n: '04', title: 'Safe Transit', body: 'Escorted directly to your verified chauffeur or designated pickup point.' },
];

const TESTIMONIALS = [
  { quote: 'P2C turned a 2-hour ordeal into a 5-minute breeze. Absolutely essential for Lagos arrivals.', name: 'James O.', role: 'CEO, Lagos' },
  { quote: 'As a frequent flyer into Abuja, I won\'t arrive without P2C. The team is elite.', name: 'Fatima A.', role: 'Senior Diplomat' },
  { quote: 'My entire family arrived stress-free. The concierge handled everything professionally.', name: 'David K.', role: 'Business Owner' },
];

const AIRPORTS = ['Lagos (LOS)', 'Abuja (ABV)', 'Port Harcourt (PHC)', 'Kano (KAN)'];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="bg-[#020817] text-white overflow-x-hidden">

      {/* ── Hero ── */}
      <section id="home" className="relative min-h-screen flex items-center pt-40 sm:pt-48 pb-20 bg-grid">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300 text-xs font-semibold mb-8 tracking-wide">
                <Zap className="h-3.5 w-3.5" />
                Nigeria's #1 Priority Airport Concierge
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-7">
                Arrive in Nigeria<br />
                <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
                  Without Stress
                </span>
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
                P2C provides premium airport concierge services across all major Nigerian airports.
                From the gate to your car we eliminate the friction so you don't have to.
              </p>

              <div className="flex flex-wrap gap-4 mb-14">
                <Link
                  to={user ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-500 px-7 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary-600/25"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 px-7 py-3.5 text-sm font-bold text-white transition-all"
                >
                  View Services
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Shield, label: 'Verified Concierges' },
                  { icon: CheckCircle2, label: '4 Major Airports' },
                  { icon: Star, label: '4.9 / 5 Rating' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-slate-400 text-sm">
                    <Icon className="h-4 w-4 text-primary-500" />
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual card */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main card */}
                <div className="rounded-3xl bg-slate-900 border border-slate-700/60 p-8 shadow-2xl glow-primary">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                        <Plane className="h-5 w-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">P2C Concierge</p>
                        <p className="text-xs text-slate-500">Active assignment</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </div>

                  {/* Flight info rows */}
                  {[
                    { label: 'Flight', value: 'EK 783' },
                    { label: 'Airport', value: 'Lagos (LOS)' },
                    { label: 'Arrival', value: 'Today, 14:30' },
                    { label: 'Tier', value: 'Premium Concierge' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0">
                      <span className="text-xs uppercase tracking-widest text-slate-600 font-bold">{label}</span>
                      <span className="text-sm font-semibold text-white">{value}</span>
                    </div>
                  ))}

                  {/* Status progress */}
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Progress</p>
                    <div className="flex items-center gap-1">
                      {['Gate Meet', 'Immigration', 'Baggage', 'Escort'].map((step, i) => (
                        <React.Fragment key={step}>
                          <div className={`flex-1 text-center`}>
                            <div className={`h-1.5 rounded-full mb-2 ${i < 2 ? 'bg-primary-500' : 'bg-slate-800'}`} />
                            <p className={`text-[9px] font-bold uppercase tracking-wider ${i < 2 ? 'text-primary-400' : 'text-slate-600'}`}>{step}</p>
                          </div>
                          {i < 3 && <div className="w-2" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating concierge badge */}
                <div className="absolute -bottom-6 -left-6 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold text-sm">A</div>
                  <div>
                    <p className="text-white text-xs font-bold">Amara O.</p>
                    <p className="text-slate-500 text-[10px]">Your Concierge · ⭐ 4.98</p>
                  </div>
                </div>

                {/* Floating airport badge */}
                <div className="absolute -top-4 -right-4 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary-400" />
                    <span className="text-white text-xs font-bold">4 Airports</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {AIRPORTS.map((a) => (
                      <span key={a} className="text-[9px] text-primary-400 bg-primary-500/10 border border-primary-500/20 px-1.5 py-0.5 rounded font-bold">
                        {a.split('(')[1].replace(')', '')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50">
            {[
              { value: '2,400+', label: 'Passengers Served' },
              { value: '50+', label: 'Verified Concierges' },
              { value: '4', label: 'Major Airports' },
              { value: '99%', label: 'Satisfaction Rate' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-slate-900/80 px-6 py-5 text-center sm:text-left">
                <p className="text-2xl font-extrabold text-white mb-0.5">{value}</p>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-28 relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-600/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.25em] text-primary-400 uppercase mb-4">Service Tiers</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">Choose Your Experience</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">Every tier includes a verified concierge. The difference is depth of service.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-3xl p-8 border transition-all group hover:-translate-y-1 hover:shadow-2xl ${
                  tier.popular
                    ? 'bg-slate-800 border-primary-500/50 shadow-xl shadow-primary-500/10'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[10px] font-extrabold px-4 py-1 rounded-full uppercase tracking-widest whitespace-nowrap shadow-lg shadow-primary-600/30">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-sm text-slate-500">{tier.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-white">${tier.price}</span>
                  <span className="text-slate-500 text-sm">/booking</span>
                </div>

                <ul className="space-y-3 mb-4 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-primary-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {tier.note && (
                  <p className="text-[11px] text-amber-400/70 bg-amber-400/5 border border-amber-400/15 rounded-lg px-3 py-2 mb-6 leading-relaxed">
                    ⚠ {tier.note}
                  </p>
                )}

                <Link
                  to="/signup"
                  className={`block text-center py-3 rounded-xl text-sm font-bold transition-all ${
                    tier.popular
                      ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="guide" className="py-28 bg-slate-900/40 border-y border-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-primary-400 uppercase mb-4">The Process</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-14">How P2C Works</h2>

              <div className="space-y-10">
                {STEPS.map((s, i) => (
                  <div key={s.n} className="flex gap-6 group">
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 group-hover:border-primary-500/40 group-hover:bg-slate-800 flex items-center justify-center text-xs font-extrabold text-slate-400 group-hover:text-primary-400 transition-all">
                        {s.n}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="w-px flex-1 mt-3 bg-slate-800" />
                      )}
                    </div>
                    <div className="pt-1 pb-8">
                      <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
                      <p className="text-slate-400 leading-relaxed text-sm">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <p className="text-xs font-bold tracking-[0.25em] text-primary-400 uppercase mb-6">What Passengers Say</p>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-700 transition-all">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary-500/20 border border-primary-500/20 flex items-center justify-center text-primary-400 text-xs font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{t.name}</p>
                      <p className="text-slate-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── About / CTA ── */}
      <section id="about" className="py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-10 md:p-16 overflow-hidden text-center">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-600/10 rounded-full blur-[80px]" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 mx-auto mb-6">
                <Plane className="h-8 w-8 text-primary-400" />
              </div>
              <p className="text-xs font-bold tracking-[0.25em] text-primary-400 uppercase mb-4">Our Mission</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 max-w-2xl mx-auto">
                Restoring Trust in Nigerian Airport Logistics
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
                Founded by frequent travellers and logistics experts, P2C bridges the gap between
                landing and leaving — professionally, safely, and without compromise.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to={user ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-500 px-7 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-primary-600/20"
                >
                  Book Your Concierge
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/50 hover:bg-slate-800 px-7 py-3.5 text-sm font-bold text-white transition-all"
                >
                  View Plans
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 bg-[#020817] pt-16 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center gap-2 mb-5">
                <Plane className="h-7 w-7 text-primary-500" />
                <span className="text-xl font-extrabold text-white tracking-tight">P2C</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">
                Your luxury gateway to Nigeria. Stress-free, secure, and professional airport concierge across 4 major airports.
              </p>
              <div className="flex gap-3">
                {[Twitter, Instagram, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-primary-400 hover:border-primary-500/30 transition-all">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white text-xs font-extrabold uppercase tracking-[0.2em] mb-5">Navigate</h4>
              <ul className="space-y-3">
                {['Home', 'Services', 'About Us', 'User Guide'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase().replace(' ', '')}`} className="text-slate-500 hover:text-white text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-xs font-extrabold uppercase tracking-[0.2em] mb-5">Support</h4>
              <ul className="space-y-3">
                {['Contact Support', 'Terms of Service', 'Privacy Policy', 'Airport Partners'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-700 text-xs font-bold uppercase tracking-widest">
              © 2026 P2C Ltd.
            </p>
            <p className="text-slate-700 text-xs">Built for excellence in Nigerian travel.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
