import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { formatArrival } from '../utils/format';
import { UserCheck, MapPin, CheckCircle2, Clock, Plane, Briefcase, AlertCircle, ChevronRight } from 'lucide-react';

const STATUS_FLOW = [
  { from: ['confirmed', 'assigned'],  to: 'passenger_arrived',  label: 'Mark Arrived',    color: 'primary' },
  { from: ['passenger_arrived'],      to: 'passenger_met',       label: 'Mark Met',         color: 'primary' },
  { from: ['passenger_met'],          to: 'baggage_assistance',  label: 'Baggage Assist',   color: 'primary' },
  { from: ['baggage_assistance'],     to: 'escort_in_progress',  label: 'Start Escort',     color: 'primary' },
  { from: ['escort_in_progress'],     to: 'completed',           label: 'Complete',         color: 'green' },
];

function nextAction(status) {
  return STATUS_FLOW.find(s => s.from.includes(status)) || null;
}

export default function ConciergeDashboard() {
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    api.get('/bookings/', { signal: controller.signal })
      .then(r => setBookings(r.data))
      .catch(err => { if (err.name !== 'AbortError' && err.name !== 'CanceledError') console.error(err); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const updateStatus = async (bookingId, status) => {
    const previous = bookings;
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    setUpdateError('');
    try {
      await api.patch(`/concierge/bookings/${bookingId}/status`, { status });
    } catch (err) {
      setBookings(previous);
      setUpdateError(err.response?.data?.error || 'Failed to update status. Please try again.');
    }
  };

  const active    = bookings.filter(b => !['completed', 'cancelled'].includes(b.status));
  const completed = bookings.filter(b => b.status === 'completed');

  return (
    <div className="min-h-screen bg-[#020817] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-1">Concierge Workspace</h1>
          <p className="text-slate-500 text-sm">Real-time passenger assistance & tracking</p>
        </div>

        {/* Stats */}
        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Assignments', value: bookings.length },
              { label: 'Active',            value: active.length },
              { label: 'Completed',         value: completed.length },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                <p className="text-2xl font-extrabold text-white mb-0.5">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Error banner */}
        {updateError && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/8 border border-red-500/20 p-4 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {updateError}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <div className="h-8 w-8 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin mb-4" />
            <p className="text-sm">Loading your assignments…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-slate-800">
            <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-5">
              <UserCheck className="h-7 w-7 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No active assignments</h3>
            <p className="text-slate-500 text-sm max-w-xs text-center">
              Assignments appear here once the admin assigns you to a booking.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const action = nextAction(b.status);
              const isCompleted = b.status === 'completed';

              return (
                <div
                  key={b.id}
                  className={`rounded-2xl border p-6 transition-all ${
                    isCompleted
                      ? 'bg-slate-900/40 border-slate-800/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Passenger info */}
                    <div className="flex items-center gap-4 lg:w-48 shrink-0">
                      <div className="h-11 w-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-extrabold text-sm shrink-0">
                        {b.profiles?.full_name?.[0] ?? 'P'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-bold text-sm truncate">{b.profiles?.full_name ?? 'Passenger'}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${
                          isCompleted
                            ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                            : 'text-primary-400 bg-primary-400/10 border-primary-400/20'
                        }`}>
                          {b.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Flight details */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { icon: Plane,    label: 'Flight',   value: b.flight_number },
                        { icon: MapPin,   label: 'Airport',  value: b.airports?.code ?? '—' },
                        { icon: Clock,    label: 'Arrival',  value: formatArrival(b.arrival_time) },
                        { icon: Briefcase, label: 'Tier',   value: b.service_tiers?.name ?? '—', accent: true },
                      ].map(({ icon: Icon, label, value, accent }) => (
                        <div key={label}>
                          <div className="flex items-center gap-1.5 text-slate-600 mb-1">
                            <Icon className="h-3 w-3" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                          </div>
                          <p className={`text-sm font-semibold ${accent ? 'text-primary-400' : 'text-white'}`}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Action */}
                    <div className="shrink-0 lg:w-40">
                      {isCompleted ? (
                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                          <CheckCircle2 className="h-5 w-5" />
                          Completed
                        </div>
                      ) : action ? (
                        <button
                          onClick={() => updateStatus(b.id, action.to)}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                            action.color === 'green'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                              : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20'
                          }`}
                        >
                          {action.label}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
