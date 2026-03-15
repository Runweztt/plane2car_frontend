import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { UserCheck, MapPin, CheckCircle2, Clock, Plane, Briefcase } from 'lucide-react';

const ConciergeDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      await api.patch(`/concierge/bookings/${bookingId}/status`, { status });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const StatusButton = ({ onClick, children, success = false }) => (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
        success 
          ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/20' 
          : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">Concierge Workspace</h1>
          <p className="text-slate-400">Real-time passenger assistance & tracking</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">
            <Clock className="h-10 w-10 mx-auto mb-4 opacity-20" />
            Loading assignments...
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-slate-800 bg-slate-800/20">
            <UserCheck className="h-16 w-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No active assignments</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Assignments will appear here once confirmed by the system admin.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl bg-slate-800 p-6 border border-slate-700 shadow-xl shadow-black/20 hover:border-primary-500/30 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <h3 className="text-xl font-bold text-white">{booking.profiles?.full_name || 'Guest Passenger'}</h3>
                      <span className="bg-primary-500/10 text-primary-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-primary-500/20">
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Plane className="h-3 w-3" />
                          <p className="text-[10px] uppercase font-bold tracking-widest">Flight</p>
                        </div>
                        <p className="text-white font-mono">{booking.flight_number}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="h-3 w-3" />
                          <p className="text-[10px] uppercase font-bold tracking-widest">Airport</p>
                        </div>
                        <p className="text-white">{booking.airports?.code}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="h-3 w-3" />
                          <p className="text-[10px] uppercase font-bold tracking-widest">Arrival</p>
                        </div>
                        <p className="text-white">{new Date(booking.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Briefcase className="h-3 w-3" />
                          <p className="text-[10px] uppercase font-bold tracking-widest">Tier</p>
                        </div>
                        <p className="text-primary-400 font-bold">{booking.service_tiers?.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-700">
                    {booking.status === 'confirmed' || booking.status === 'assigned' ? (
                      <StatusButton onClick={() => updateStatus(booking.id, 'passenger_arrived')}>Mark Arrived</StatusButton>
                    ) : booking.status === 'passenger_arrived' ? (
                      <StatusButton onClick={() => updateStatus(booking.id, 'passenger_met')}>Mark Met</StatusButton>
                    ) : booking.status === 'passenger_met' ? (
                      <StatusButton onClick={() => updateStatus(booking.id, 'baggage_assistance')}>Baggage Assist</StatusButton>
                    ) : booking.status === 'baggage_assistance' ? (
                      <StatusButton onClick={() => updateStatus(booking.id, 'escort_in_progress')}>Start Escort</StatusButton>
                    ) : booking.status === 'escort_in_progress' ? (
                      <StatusButton onClick={() => updateStatus(booking.id, 'completed')} success>Complete</StatusButton>
                    ) : (
                       <div className="flex items-center gap-2 text-green-500 text-sm font-bold bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                          <CheckCircle2 className="h-4 w-4" />
                          SERVICE COMPLETED
                       </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConciergeDashboard;
