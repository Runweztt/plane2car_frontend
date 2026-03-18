import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { formatArrivalShort } from '../utils/format';
import { Plus, Clock, Plane, MapPin, Calendar, Briefcase, ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_STYLES = {
  pending:            'text-amber-400  bg-amber-400/10  border-amber-400/20',
  assigned:           'text-blue-400   bg-blue-400/10   border-blue-400/20',
  passenger_arrived:  'text-cyan-400   bg-cyan-400/10   border-cyan-400/20',
  passenger_met:      'text-violet-400 bg-violet-400/10 border-violet-400/20',
  baggage_assistance: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  escort_in_progress: 'text-primary-400 bg-primary-400/10 border-primary-400/20',
  completed:          'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  cancelled:          'text-red-400    bg-red-400/10    border-red-400/20',
};

function statusStyle(status) {
  return STATUS_STYLES[status] ?? 'text-slate-400 bg-slate-400/10 border-slate-400/20';
}

export default function PassengerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/bookings/', { signal: controller.signal })
      .then(r => setBookings(r.data))
      .catch(err => { if (err.name !== 'AbortError' && err.name !== 'CanceledError') console.error(err); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const completed = bookings.filter(b => b.status === 'completed').length;
  const active    = bookings.filter(b => !['completed','cancelled'].includes(b.status)).length;

  return (
    <div className="min-h-screen bg-[#020817] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">My Bookings</h1>
            <p className="text-slate-500 text-sm">Manage your priority concierge bookings</p>
          </div>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-500 px-5 py-3 text-sm font-bold text-white transition-all shadow-lg shadow-primary-600/20 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            New Booking
          </Link>
        </div>

        {/* Stats */}
        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Bookings', value: bookings.length, icon: Briefcase },
              { label: 'Active',         value: active,          icon: TrendingUp },
              { label: 'Completed',      value: completed,       icon: Clock },
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
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <div className="h-8 w-8 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin mb-4" />
            <p className="text-sm">Loading your travel history…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-slate-800">
            <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-5">
              <Plane className="h-7 w-7 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
            <p className="text-slate-500 text-sm mb-8 max-w-xs text-center">
              Ready for a stress-free arrival in Nigeria? Book your first priority concierge.
            </p>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-bold text-sm transition-colors"
            >
              Create your first booking
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 group-hover:border-primary-500/20 flex items-center justify-center transition-all">
                      <Plane className="h-4 w-4 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-lg font-extrabold text-white leading-tight">{b.airports?.code ?? '—'}</p>
                      <p className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">Airport</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusStyle(b.status)}`}>
                    {b.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                      <Briefcase className="h-3.5 w-3.5" /> Flight
                    </span>
                    <span className="text-white font-mono font-semibold">{b.flight_number}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                      <Calendar className="h-3.5 w-3.5" /> Arrival
                    </span>
                    <span className="text-white text-xs">{formatArrivalShort(b.arrival_time)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                      <MapPin className="h-3.5 w-3.5" /> Tier
                    </span>
                    <span className="text-primary-400 font-bold text-xs">{b.service_tiers?.name ?? '—'}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-700 font-mono">#{b.id.slice(0, 8)}</span>
                  {b.concierge_id && (
                    <span className="text-[10px] text-emerald-500 font-semibold">Concierge assigned</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
