import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Clock, CheckCircle, AlertCircle, Plane, MapPin, Calendar, ChevronRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const PassengerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/');
        setBookings(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-primary-500 bg-primary-500/10 border-primary-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
            <p className="text-slate-400">Manage your priority airport clearances</p>
          </div>
          <Link
            to="/book"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            New Booking
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">
             <Clock className="h-10 w-10 mx-auto mb-4 opacity-20" />
             Loading your travel history...
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-slate-800 bg-slate-800/10">
            <Clock className="h-14 w-14 text-slate-700 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">No bookings found</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't scheduled any priority clearances yet. Ready for a stress-free arrival?</p>
            <Link to="/book" className="inline-flex items-center gap-2 text-primary-400 font-bold hover:text-primary-300 transition-colors uppercase tracking-widest text-sm">
              Create your first booking <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl bg-slate-800 p-6 border border-slate-700 hover:border-primary-500/30 transition-all shadow-xl shadow-black/20 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                     <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700 group-hover:border-primary-500/20 transition-colors">
                        <Plane className="h-5 w-5 text-primary-500" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white leading-tight">{booking.airports?.code}</h3>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Airport Code</p>
                     </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-4 text-sm mb-8">
                  <div className="flex justify-between items-center text-slate-400">
                    <div className="flex items-center gap-2">
                       <Briefcase className="h-3.5 w-3.5" />
                       <span className="text-xs uppercase font-bold tracking-tighter">Flight No.</span>
                    </div>
                    <span className="text-white font-mono font-medium">{booking.flight_number}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <div className="flex items-center gap-2">
                       <Calendar className="h-3.5 w-3.5" />
                       <span className="text-xs uppercase font-bold tracking-tighter">Arrival</span>
                    </div>
                    <span className="text-white font-medium text-right">
                      {new Date(booking.arrival_time).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} at {new Date(booking.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <div className="flex items-center gap-2">
                       <MapPin className="h-3.5 w-3.5" />
                       <span className="text-xs uppercase font-bold tracking-tighter">Tier</span>
                    </div>
                    <span className="text-primary-400 font-bold">{booking.service_tiers?.name}</span>
                  </div>
                </div>

                <Link 
                  to={`/booking/${booking.id}`} 
                  className="flex w-full items-center justify-center gap-2 py-3 bg-slate-900 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-all uppercase tracking-widest border border-slate-700"
                >
                  View Full Details
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerDashboard;
