import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  Shield, Briefcase, CheckCircle2, UserPlus, Phone, Mail,
  Users, Eye, EyeOff, AlertCircle,
} from 'lucide-react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [pendingConcierges, setPendingConcierges] = useState([]);
  const [approvedConcierges, setApprovedConcierges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState({});

  // Add concierge form
  const [form, setForm] = useState({ full_name: '', email: '', phone_number: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get('/bookings/');
      setBookings(res.data);
    } catch (err) { console.error('bookings:', err); }

    try {
      const res = await api.get('/admin/concierges/pending');
      setPendingConcierges(res.data);
    } catch (err) { console.error('pending concierges:', err); }

    try {
      const res = await api.get('/admin/concierges/approved');
      setApprovedConcierges(res.data);
    } catch (err) { console.error('approved concierges:', err); }

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const verifyConcierge = async (id, status) => {
    await api.post('/admin/concierges/verify', { concierge_id: id, status });
    fetchData();
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

  const formatArrival = (ts) => {
    if (!ts) return '—';
    try {
      return new Date(ts).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Control Center</h1>
          <p className="text-slate-400">System oversight &amp; concierge management</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ── Left: All Bookings ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-slate-800 p-6 border border-slate-700 shadow-xl shadow-black/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary-500" />
                All Bookings
              </h2>

              {bookings.length === 0 ? (
                <p className="text-center text-slate-500 italic py-8">No bookings yet</p>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                      <thead className="text-xs uppercase text-slate-500 font-bold border-b border-slate-700">
                        <tr>
                          <th className="pb-4 text-white">Passenger</th>
                          <th className="pb-4">Flight</th>
                          <th className="pb-4">Arrival</th>
                          <th className="pb-4">Status</th>
                          <th className="pb-4">Assign Concierge</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-primary-400 font-bold text-xs uppercase">
                                  {b.profiles?.full_name?.charAt(0) || 'G'}
                                </div>
                                <span className="text-white font-medium">
                                  {b.profiles?.full_name || 'Guest'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 font-mono">{b.flight_number}</td>
                            <td className="py-4 text-xs">{formatArrival(b.arrival_time)}</td>
                            <td className="py-4">
                              <span className="px-3 py-1 rounded-full text-[10px] bg-slate-900 text-primary-400 border border-primary-500/20 uppercase font-bold tracking-widest">
                                {b.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-4">
                              {b.concierge?.full_name ? (
                                <div>
                                  <span className="text-slate-300 text-xs font-medium">
                                    {b.concierge.full_name}
                                  </span>
                                  {b.concierge.phone_number && (
                                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                      <Phone className="h-3 w-3" />{b.concierge.phone_number}
                                    </p>
                                  )}
                                </div>
                              ) : approvedConcierges.length === 0 ? (
                                <span className="text-slate-600 text-xs italic">No approved concierges</span>
                              ) : (
                                <select
                                  defaultValue=""
                                  onChange={(e) => assignConcierge(b.id, e.target.value)}
                                  disabled={assigning[b.id]}
                                  className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-primary-500 focus:outline-none disabled:opacity-50"
                                >
                                  <option value="" disabled>Select concierge</option>
                                  {approvedConcierges.map((c) => (
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

                  {/* Mobile List */}
                  <div className="md:hidden space-y-4">
                    {bookings.map((b) => (
                      <div key={b.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-700 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-primary-400 font-bold text-xs">
                              {b.profiles?.full_name?.charAt(0) || 'G'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">
                                {b.profiles?.full_name || 'Guest'}
                              </p>
                              <p className="text-[10px] text-slate-500 uppercase font-mono">
                                {b.flight_number}
                              </p>
                              <p className="text-[10px] text-slate-600">{formatArrival(b.arrival_time)}</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[9px] bg-primary-500/10 text-primary-400 border border-primary-500/20 uppercase font-bold">
                            {b.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="pt-3 border-t border-slate-800">
                          {b.concierge?.full_name ? (
                            <div>
                              <p className="text-xs text-slate-300 font-medium">{b.concierge.full_name}</p>
                              {b.concierge.phone_number && (
                                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                  <Phone className="h-3 w-3" />{b.concierge.phone_number}
                                </p>
                              )}
                            </div>
                          ) : approvedConcierges.length > 0 ? (
                            <select
                              defaultValue=""
                              onChange={(e) => assignConcierge(b.id, e.target.value)}
                              disabled={assigning[b.id]}
                              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-primary-500 focus:outline-none disabled:opacity-50"
                            >
                              <option value="" disabled>Assign concierge...</option>
                              {approvedConcierges.map((c) => (
                                <option key={c.id} value={c.id}>{c.full_name}</option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-xs text-slate-600 italic">No approved concierges</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="space-y-6">

            {/* Add Concierge */}
            <div className="rounded-2xl bg-slate-800 p-6 border border-slate-700 shadow-xl shadow-black/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-primary-500" />
                Add Concierge
              </h2>

              <form onSubmit={handleAddConcierge} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-primary-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Amara Okafor"
                    value={form.full_name}
                    onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-primary-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email <span className="text-primary-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="concierge@example.com"
                      value={form.email}
                      onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-lg border border-slate-600 bg-slate-900 pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-primary-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={form.phone_number}
                      onChange={(e) => setForm(f => ({ ...f, phone_number: e.target.value }))}
                      className="w-full rounded-lg border border-slate-600 bg-slate-900 pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-primary-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Temporary Password
                    <span className="ml-2 text-slate-600 normal-case font-normal">(auto-generated if blank)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Leave blank to auto-generate"
                      value={form.password}
                      onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 pr-10 py-2.5 text-sm text-white placeholder-slate-600 focus:border-primary-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Feedback message */}
                {formMsg && (
                  <div className={`flex items-start gap-2 rounded-lg p-3 text-xs ${
                    formMsg.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}>
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    {formMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-lg transition-all"
                >
                  {submitting ? 'Creating...' : 'Add Concierge'}
                </button>
              </form>
            </div>

            {/* Approved Team */}
            {approvedConcierges.length > 0 && (
              <div className="rounded-2xl bg-slate-800 p-6 border border-slate-700 shadow-xl shadow-black/20">
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary-500" />
                  Concierge Team
                  <span className="ml-auto text-xs font-normal text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full">
                    {approvedConcierges.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {approvedConcierges.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                      <div className="h-8 w-8 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-xs uppercase shrink-0">
                        {c.full_name?.charAt(0) || 'C'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{c.full_name}</p>
                        {c.phone_number ? (
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" />{c.phone_number}
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-600 mt-0.5 truncate">{c.email}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Verifications */}
            <div className="rounded-2xl bg-slate-800 p-6 border border-slate-700 shadow-xl shadow-black/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary-500" />
                Verifications
                {pendingConcierges.length > 0 && (
                  <span className="ml-auto text-xs font-normal text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                    {pendingConcierges.length} pending
                  </span>
                )}
              </h2>
              {pendingConcierges.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 italic">No pending verifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingConcierges.map((c) => (
                    <div key={c.id} className="p-5 rounded-xl bg-slate-900 border border-slate-700 hover:border-primary-500/20 transition-all">
                      <div className="mb-4">
                        <p className="text-white font-bold">{c.full_name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />{c.email}
                        </p>
                        {c.phone_number && (
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" />{c.phone_number}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => verifyConcierge(c.id, 'approved')}
                          className="flex-1 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-lg transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => verifyConcierge(c.id, 'rejected')}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-lg transition-all"
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
};

export default AdminDashboard;
