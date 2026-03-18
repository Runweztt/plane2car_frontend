import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { PlaneTakeoff, Info, Calendar, MapPin, Layers, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function BookingForm() {
  const [airports, setAirports] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({ airport_id: '', service_tier_id: '', flight_number: '', arrival_time: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const [ar, tr] = await Promise.all([
          api.get('/bookings/airports', { signal: controller.signal }),
          api.get('/bookings/tiers',    { signal: controller.signal }),
        ]);
        setAirports(ar.data);
        setTiers(tr.data);
        // Default to the first ACTIVE airport so the form is immediately usable
        const firstActive = ar.data.find(a => a.is_active);
        setFormData(prev => ({
          ...prev,
          ...(firstActive            && { airport_id:      firstActive.id }),
          ...(tr.data.length > 0     && { service_tier_id: tr.data[0].id }),
        }));
      } catch (err) {
        if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
          const detail = err.response
            ? `Server returned ${err.response.status}`
            : `Network error — ${err.message}`;
          setFetchError(`Could not load form data. ${detail}. Please refresh.`);
          console.error('[BookingForm] fetch failed:', detail, err);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await api.post('/bookings/', formData);
      navigate(`/payment/${res.data.id}`);
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAirport = airports.find(a => String(a.id) === String(formData.airport_id));
  const airportUnavailable = selectedAirport && !selectedAirport.is_active;

  const SELECT_CLASS = 'w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all appearance-none';
  const INPUT_CLASS  = 'w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all';

  const selectedTier = tiers.find(t => String(t.id) === String(formData.service_tier_id));

  return (
    <div className="min-h-screen bg-[#020817] pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">

        {/* Back */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-semibold mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Book Priority Concierge</h1>
          <p className="text-slate-500">Complete the form below — your concierge will be assigned within minutes.</p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-primary-600 via-blue-500 to-primary-600" />

          <div className="p-8">
            {fetchError && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/8 border border-red-500/20 p-4 text-sm text-red-400">
                <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold">!</span>
                </div>
                {fetchError}
              </div>
            )}

            {submitError && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/8 border border-red-500/20 p-4 text-sm text-red-400">
                <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold">!</span>
                </div>
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Row 1 */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <MapPin className="h-3.5 w-3.5 text-primary-500" /> Arrival Airport
                  </label>
                  <select
                    required
                    value={formData.airport_id}
                    onChange={e => setFormData(prev => ({ ...prev, airport_id: e.target.value }))}
                    className={`${SELECT_CLASS} ${airportUnavailable ? 'border-amber-500/50' : ''}`}
                    disabled={loading}
                  >
                    {loading && <option value="" disabled>Loading airports…</option>}
                    {!loading && airports.length === 0 && <option value="" disabled>No airports available</option>}
                    {airports.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.is_active ? '' : '🔒 '}{a.name} ({a.code}){a.is_active ? '' : ' — Coming Soon'}
                      </option>
                    ))}
                  </select>
                  {airportUnavailable && (
                    <p className="mt-2 text-xs text-amber-400 flex items-center gap-1.5">
                      <span className="shrink-0">⚠</span>
                      This airport is not yet available. Please select Murtala Muhammed International Airport (LOS).
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <Layers className="h-3.5 w-3.5 text-primary-500" /> Service Tier
                  </label>
                  <select
                    required
                    value={formData.service_tier_id}
                    onChange={e => setFormData(prev => ({ ...prev, service_tier_id: e.target.value }))}
                    className={SELECT_CLASS}
                    disabled={loading}
                  >
                    {loading && <option value="" disabled>Loading tiers…</option>}
                    {!loading && tiers.length === 0 && <option value="" disabled>No tiers available</option>}
                    {tiers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} — ${t.price}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <PlaneTakeoff className="h-3.5 w-3.5 text-primary-500" /> Flight Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EK783"
                    className={INPUT_CLASS}
                    value={formData.flight_number}
                    onChange={e => setFormData(prev => ({ ...prev, flight_number: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <Calendar className="h-3.5 w-3.5 text-primary-500" /> Scheduled Arrival
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className={INPUT_CLASS}
                    value={formData.arrival_time}
                    onChange={e => setFormData(prev => ({ ...prev, arrival_time: e.target.value }))}
                  />
                </div>
              </div>

              {/* Selected tier summary */}
              {selectedTier && (
                <div className="rounded-xl bg-primary-500/5 border border-primary-500/15 p-5 flex gap-4">
                  <div className="h-9 w-9 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                    <Info className="h-4 w-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm mb-1">{selectedTier.name} — ${selectedTier.price}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {selectedTier.description || 'Your verified concierge will meet you at the aircraft gate and handle all immigration and baggage formalities.'}
                    </p>
                  </div>
                </div>
              )}

              {/* What to expect */}
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  'Gate arrival meetup',
                  'Immigration fast-track',
                  'Escort to your vehicle',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting || loading || airportUnavailable}
                className="w-full flex items-center justify-center gap-3 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-4 text-sm font-bold text-white transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98]"
              >
                {!submitting && <PlaneTakeoff className="h-5 w-5" />}
                {submitting ? 'Confirming…' : 'Confirm Priority Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
