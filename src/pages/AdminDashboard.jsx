import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { formatArrival } from '../utils/format';
import {
  Shield, Briefcase, CheckCircle2, UserPlus, Phone, Mail,
  Users, Eye, EyeOff, AlertCircle, TrendingUp, Clock,
} from 'lucide-react';

export default function AdminDashboard() {
  const [bookings, setBookings]                 = useState([]);
  const [pendingConcierges, setPendingConcierges] = useState([]);
  const [approvedConcierges, setApprovedConcierges] = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [assigning, setAssigning]               = useState({});

  const [form, setForm]             = useState({ full_name: '', email: '', phone_number: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg]       = useState(null);

  const fetchData = async (signal) => {
    try {
      const [bookingsRes, pendingRes, approvedRes] = await Promise.all([
        api.get('/bookings/',                   { signal }),
        api.get('/admin/concierges/pending',    { signal }),
        api.get('/admin/concierges/approved',   { signal }),
      ]);
      setBookings(bookingsRes.data);
      setPendingConcierges(pendingRes.data);
      setApprovedConcierges(approvedRes.data);
    } catch (err) {
      if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
        console.error('Dashboard fetch failed:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, []);

  const verifyConcierge = async (id, status) => {
    try {
      await api.post('/admin/concierges/verify', { concierge_id: id, status });
      fetchData();
    } catch (err) {
      console.error('Verify failed:', err);
    }
  };

  const assignConcierge = async (bookingId, conciergeId) => {
    if (!conciergeId) return;
    setAssigning(prev => ({ ...prev, [bookingId]: true }));
    try {
      await api.post('/admin/bookings/assign', { booking_id: bookingId, concierge_id: conciergeId });
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setAssigning(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleAddConcierge = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) {
      setFormMsg({ type: 'error', text: 'Name and email are required.' });
      return;
    }
    setSubmitting(true);
    setFormMsg(null);
    try {
      await api.post('/admin/concierges/add', form);
      setFormMsg({ type: 'success', text: `Concierge "${form.full_name}" added. Welcome email sent.` });
      setForm({ full_name: '', email: '', phone_number: '', password: '' });
      fetchData();
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.error || 'Failed to add concierge.' });
    } finally {
      setSubmitting(false);
    }
  };

  const INPUT_CLASS = 'w-full rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all';

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020817]">
        <div className="text-center">
          <div className="h-10 w-10 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  const pending   = bookings.filter(b => b.status === 'pending').length;
  const active    = bookings.filter(b => !['completed','cancelled','pending'].includes(b.status)).length;

  return (
    <div className="min-h-screen bg-[#020817] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-1">Admin Control Centre</h1>
          <p className="text-slate-500 text-sm">System oversight &amp; concierge management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings',   value: bookings.length,            icon: Briefcase },
            { label: 'Pending',          value: pending,                    icon: Clock },
            { label: 'Active',           value: active,                     icon: TrendingUp },
            { label: 'Concierge Team',   value: approvedConcierges.length,  icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Bookings Table ── */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary-500" />
                  All Bookings
                </h2>
                <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full font-semibold">
                  {bookings.length} total
                </span>
              </div>

              {bookings.length === 0 ? (
                <div className="py-16 text-center text-slate-600 text-sm">No bookings yet</div>
              ) : (
                <>
                  {/* Desktop */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600 border-b border-slate-800">
                          <th className="px-6 pb-4 pt-4">Passenger</th>
                          <th className="px-4 pb-4 pt-4">Flight</th>
                          <th className="px-4 pb-4 pt-4">Arrival</th>
                          <th className="px-4 pb-4 pt-4">Status</th>
                          <th className="px-4 pb-4 pt-4">Payment</th>
                          <th className="px-4 pb-4 pt-4">Concierge</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-primary-400 font-bold text-xs uppercase shrink-0">
                                  {b.profiles?.full_name?.[0] ?? 'G'}
                                </div>
                                <span className="text-white font-semibold text-sm">{b.profiles?.full_name ?? 'Guest'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-slate-400 font-mono text-xs">{b.flight_number}</td>
                            <td className="px-4 py-4 text-slate-500 text-xs">{formatArrival(b.arrival_time)}</td>
                            <td className="px-4 py-4">
                              <span className="px-2.5 py-1 rounded-full text-[10px] bg-slate-800 text-primary-400 border border-primary-500/20 uppercase font-bold tracking-widest whitespace-nowrap">
                                {b.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest whitespace-nowrap border ${
                                b.payment_status === 'paid'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                {b.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              {b.concierge?.full_name ? (
                                <div>
                                  <p className="text-white text-xs font-semibold">{b.concierge.full_name}</p>
                                  {b.concierge.phone_number && (
                                    <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                                      <Phone className="h-3 w-3" />{b.concierge.phone_number}
                                    </p>
                                  )}
                                </div>
                              ) : approvedConcierges.length === 0 ? (
                                <span className="text-slate-700 text-xs italic">None available</span>
                              ) : (
                                <select
                                  defaultValue=""
                                  onChange={(e) => assignConcierge(b.id, e.target.value)}
                                  disabled={assigning[b.id]}
                                  className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white focus:border-primary-500 focus:outline-none disabled:opacity-50"
                                >
                                  <option value="" disabled>Assign…</option>
                                  {approvedConcierges.map(c => (
                                    <option key={c.id} value={c.id}>{c.full_name}</option>
                                  ))}
                                </select>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="md:hidden divide-y divide-slate-800">
                    {bookings.map((b) => (
                      <div key={b.id} className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-primary-400 font-bold text-xs">
                              {b.profiles?.full_name?.[0] ?? 'G'}
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">{b.profiles?.full_name ?? 'Guest'}</p>
                              <p className="text-xs text-slate-600 font-mono">{b.flight_number}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-primary-500/10 text-primary-400 border border-primary-500/20 uppercase font-bold">
                              {b.status.replace(/_/g, ' ')}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                              b.payment_status === 'paid'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              {b.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600">{formatArrival(b.arrival_time)}</p>
                        {b.concierge?.full_name ? (
                          <p className="text-xs text-slate-300 font-semibold">{b.concierge.full_name}</p>
                        ) : approvedConcierges.length > 0 ? (
                          <select
                            defaultValue=""
                            onChange={(e) => assignConcierge(b.id, e.target.value)}
                            disabled={assigning[b.id]}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-2 text-xs text-white focus:outline-none"
                          >
                            <option value="" disabled>Assign concierge…</option>
                            {approvedConcierges.map(c => (
                              <option key={c.id} value={c.id}>{c.full_name}</option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-xs text-slate-700 italic">No approved concierges</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">

            {/* Add Concierge */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800">
              <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary-500" />
                <h2 className="text-base font-bold text-white">Add Concierge</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleAddConcierge} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-primary-500">*</span>
                    </label>
                    <input
                      type="text" placeholder="Amara Okafor"
                      value={form.full_name}
                      onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Email <span className="text-primary-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                      <input
                        type="email" placeholder="concierge@example.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className={INPUT_CLASS.replace('px-3', 'pl-9 pr-3')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                      <input
                        type="tel" placeholder="+234 800 000 0000"
                        value={form.phone_number}
                        onChange={e => setForm(f => ({ ...f, phone_number: e.target.value }))}
                        className={INPUT_CLASS.replace('px-3', 'pl-9 pr-3')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Temp Password
                      <span className="ml-2 normal-case font-normal text-slate-600">(auto if blank)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Leave blank to auto-generate"
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        className={INPUT_CLASS.replace('px-3', 'pr-10 pl-3')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {formMsg && (
                    <div className={`flex items-start gap-2 rounded-xl p-3 text-xs border ${
                      formMsg.type === 'success'
                        ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/8 border-red-500/20 text-red-400'
                    }`}>
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      {formMsg.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-primary-600/20"
                  >
                    {submitting ? 'Creating…' : 'Add Concierge'}
                  </button>
                </form>
              </div>
            </div>

            {/* Concierge Team */}
            {approvedConcierges.length > 0 && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800">
                <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary-500" /> Team
                  </h2>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full font-semibold">{approvedConcierges.length}</span>
                </div>
                <div className="p-4 space-y-2">
                  {approvedConcierges.map(c => (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                      <div className="h-8 w-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-xs shrink-0">
                        {c.full_name?.[0] ?? 'C'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{c.full_name}</p>
                        <p className="text-[11px] text-slate-600 truncate">{c.phone_number || c.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Verifications */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800">
              <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary-500" /> Verifications
                </h2>
                {pendingConcierges.length > 0 && (
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                    {pendingConcierges.length} pending
                  </span>
                )}
              </div>

              {pendingConcierges.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle2 className="h-10 w-10 text-slate-800 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">All clear — no pending verifications</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {pendingConcierges.map(c => (
                    <div key={c.id} className="rounded-xl bg-slate-800/50 border border-slate-800 p-4">
                      <p className="text-white font-bold text-sm mb-1">{c.full_name}</p>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mb-3">
                        <Mail className="h-3 w-3" />{c.email}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => verifyConcierge(c.id, 'approved')}
                          className="bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-extrabold uppercase tracking-widest py-2 rounded-lg transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => verifyConcierge(c.id, 'rejected')}
                          className="bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-extrabold uppercase tracking-widest py-2 rounded-lg transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
