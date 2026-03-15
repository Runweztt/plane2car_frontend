import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { PlaneTakeoff, Info, Calendar, MapPin, Layers, ArrowLeft } from 'lucide-react';

const BookingForm = () => {
  const [airports, setAirports] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    airport_id: '',
    service_tier_id: '',
    flight_number: '',
    arrival_time: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [airportsRes, tiersRes] = await Promise.all([
          api.get('/bookings/airports'),
          api.get('/bookings/tiers')
        ]);
        setAirports(airportsRes.data);
        setTiers(tiersRes.data);
        if (airportsRes.data.length > 0) setFormData(prev => ({...prev, airport_id: airportsRes.data[0].id}));
        if (tiersRes.data.length > 0) setFormData(prev => ({...prev, service_tier_id: tiersRes.data[0].id}));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings/', formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-6">
           <ArrowLeft className="h-4 w-4" />
           Back to Dashboard
        </Link>
        
        <div className="rounded-3xl bg-slate-800 p-6 md:p-10 shadow-2xl border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-blue-600"></div>
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Book Priority Clearance</h2>
            <p className="text-slate-400">Arrive in Nigeria with maximum efficiency</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                   <MapPin className="h-3 w-3" />
                   Arrival Airport
                </label>
                <select
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all appearance-none"
                  value={formData.airport_id}
                  onChange={(e) => setFormData({...formData, airport_id: e.target.value})}
                >
                  {airports.map(a => <option key={a.id} value={a.id}>{a.name} ({a.code})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                   <Layers className="h-3 w-3" />
                   Service Tier
                </label>
                <select
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all appearance-none"
                  value={formData.service_tier_id}
                  onChange={(e) => setFormData({...formData, service_tier_id: e.target.value})}
                >
                  {tiers.map(t => <option key={t.id} value={t.id}>{t.name} — ${t.price}</option>)}
                </select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                   <PlaneTakeoff className="h-3 w-3" />
                   Flight Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EK783"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                  value={formData.flight_number}
                  onChange={(e) => setFormData({...formData, flight_number: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                   <Calendar className="h-3 w-3" />
                   Scheduled Arrival
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                  value={formData.arrival_time}
                  onChange={(e) => setFormData({...formData, arrival_time: e.target.value})}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-primary-500/5 p-5 flex gap-4 text-sm text-slate-300 border border-primary-500/10 shadow-inner">
              <div className="p-2 bg-primary-500/10 rounded-lg h-fit">
                <Info className="h-5 w-5 text-primary-400" />
              </div>
              <p className="leading-relaxed">
                Your verified concierge will meet you at the aircraft gate holding a personalized sign. They will handle all immigration and baggage formalities.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary-600 px-4 py-4 text-base font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-500 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <PlaneTakeoff className="h-5 w-5" />
              Confirm Priority Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
