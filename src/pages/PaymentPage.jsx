import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import {
  ArrowLeft, CreditCard, Shield, AlertCircle,
  Plane, MapPin, Calendar, Layers,
} from 'lucide-react';
import { formatArrival } from '../utils/format';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [paying, setPaying]       = useState(false);
  const [payError, setPayError]   = useState('');

  useEffect(() => {
    const controller = new AbortController();
    api.get(`/bookings/${bookingId}`, { signal: controller.signal })
      .then(r => {
        setBooking(r.data);
        // Already paid — skip straight to dashboard
        if (r.data.payment_status === 'paid') navigate('/dashboard', { replace: true });
      })
      .catch(err => {
        if (err.name !== 'AbortError' && err.name !== 'CanceledError')
          setFetchError('Could not load booking details. Please go back and try again.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [bookingId, navigate]);

  const handlePay = async () => {
    if (paying) return;
    setPaying(true);
    setPayError('');
    try {
      // Backend initialises the Paystack transaction and returns a redirect URL.
      // No payment keys exist on the frontend at all.
      const { data } = await api.post(`/bookings/${bookingId}/payment/initiate`);
      window.location.href = data.authorization_url;
    } catch (err) {
      setPayError(err.response?.data?.error || 'Could not initiate payment. Please try again.');
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020817]">
        <div className="h-8 w-8 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] pt-24 pb-16">
      <div className="mx-auto max-w-xl px-4 sm:px-6">

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-semibold mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Complete Payment</h1>
          <p className="text-slate-500">Secure your booking by completing payment below.</p>
        </div>

        {fetchError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/8 border border-red-500/20 p-4 text-sm text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            {fetchError}
          </div>
        )}

        {booking && (
          <>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl mb-5">
              <div className="h-1 bg-gradient-to-r from-primary-600 via-blue-500 to-primary-600" />
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Booking Summary</p>
                <div className="space-y-0">
                  {[
                    { icon: Plane,    label: 'Flight',  value: booking.flight_number },
                    { icon: MapPin,   label: 'Airport', value: booking.airports ? `${booking.airports.name} (${booking.airports.code})` : '—' },
                    { icon: Calendar, label: 'Arrival', value: formatArrival(booking.arrival_time) },
                    { icon: Layers,   label: 'Tier',    value: booking.service_tiers?.name ?? '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Icon className="h-3.5 w-3.5" />
                        <span className="font-bold uppercase tracking-widest">{label}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-slate-700 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Amount Due</span>
                  <span className="text-3xl font-extrabold text-white">
                    ${Number(booking.service_tiers?.price ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {payError && (
              <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-500/8 border border-red-500/20 p-4 text-sm text-red-400">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                {payError}
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-4 text-sm font-bold text-white transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98]"
            >
              {!paying && <CreditCard className="h-5 w-5" />}
              {paying ? 'Redirecting to payment…' : `Pay $${Number(booking.service_tiers?.price ?? 0).toLocaleString()}`}
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-slate-600 text-xs">
              <Shield className="h-3.5 w-3.5" />
              <span>Payments are processed securely by Paystack — P2C never sees your card details</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
