import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Paystack redirects here after the user completes (or cancels) payment.
 * URL format: /payment/callback?reference=P2C-xxx-yyy&trxref=P2C-xxx-yyy
 *
 * We forward the reference to the backend, which verifies with Paystack
 * and marks the booking paid.  No payment keys are used on the frontend.
 */
export default function PaymentCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const verified = useRef(false);

  useEffect(() => {
    if (verified.current) return;
    verified.current = true;

    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference') || params.get('trxref');

    if (!reference) {
      setStatus('error');
      setMessage('No payment reference found. If you completed payment, contact support.');
      return;
    }

    api.post('/bookings/payment/verify', { reference })
      .then(res => {
        setBookingId(res.data.booking_id);
        setStatus('success');
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Could not verify payment. If you were charged, contact support with reference: ' + reference);
      });
  }, []);

  if (status === 'verifying') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#020817] gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Verifying your payment…</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3">Payment Confirmed</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Your booking is confirmed and paid. A concierge will be assigned to you shortly.
          </p>
          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-500 px-7 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-primary-600/20"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="h-20 w-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-3">Payment Verification Failed</h1>
        <p className="text-slate-400 mb-8 text-sm leading-relaxed">{message}</p>
        <button
          onClick={() => navigate('/dashboard', { replace: true })}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-7 py-3.5 text-sm font-bold text-white transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
