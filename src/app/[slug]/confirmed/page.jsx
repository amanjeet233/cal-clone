// src/app/[slug]/confirmed/page.jsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import {
  CheckCircle,
  Calendar,
  Clock,
  Mail,
  User,
  Globe,
  Video,
  ArrowLeft,
  XCircle,
} from "lucide-react";

function ConfirmedContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const bookingId = searchParams.get("bookingId");
  const rescheduled = searchParams.get("rescheduled") === "true";
  const { slug } = params;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) return;
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        const data = await res.json();
        if (res.ok) setBooking(data);
      } catch (err) {
        console.error("Failed to load booking:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [bookingId]);

  // Simulate remote email dispatch after successful load
  useEffect(() => {
    if (booking && !loading) {
      const timer = setTimeout(() => setShowToast(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [booking, loading]);

  const getDisplayTime12h = (dateObj) => {
    return format(new Date(dateObj), "h:mm a");
  };

  return (
    // Full-width public page
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4"
      style={{ marginLeft: "-16rem" }}
    >
      <div className="w-full max-w-lg">
        {/* Success card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Green top banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-white" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {rescheduled ? "Meeting Rescheduled!" : "You're Booked!"}
            </h1>
            <p className="text-emerald-100 text-sm">
              {rescheduled ? "Your updated time has been confirmed." : "A confirmation has been sent to your email."}
            </p>
          </div>

          {/* Booking details */}
          <div className="p-8">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-5 bg-gray-100 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : booking ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-5">
                  {booking.eventType?.title}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar size={15} className="text-sky-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                        Date
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {format(
                          new Date(booking.startTime),
                          "EEEE, MMMM d, yyyy"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock size={15} className="text-sky-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                        Time
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {getDisplayTime12h(booking.startTime)} –{" "}
                        {getDisplayTime12h(booking.endTime)}
                        <span className="text-gray-400 font-normal ml-2">
                          ({booking.eventType?.duration} min)
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Video size={15} className="text-sky-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                        Location
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        Video call
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User size={15} className="text-violet-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                          Guest
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {booking.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail size={15} className="text-violet-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                          Email
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {booking.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Notes</p>
                      <p className="text-sm text-gray-600 italic">
                        "{booking.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                {rescheduled ? "Update confirmed!" : "Booking confirmed!"} Check your email for details.
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <Link
                href={`/${slug}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Book Another Meeting
              </Link>
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg text-sm font-medium transition-colors"
              >
                Print / Save
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by CalSchedule
        </p>
      </div>

      {/* Simulated Email Notification Toast */}
      <div 
        className={`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 bg-gray-900 border border-gray-700 text-white px-5 py-4 rounded-xl shadow-2xl flex items-start gap-4 transition-all duration-700 transform z-50 ${
          showToast ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-emerald-500/20 p-2 rounded-lg mt-0.5">
          <Mail size={18} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-100">
            {rescheduled ? "Update Notification Sent" : "Invitation Sent"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Simulated email successfully dispatched<br />to <span className="text-sky-400 font-medium">{booking?.email}</span>
          </p>
        </div>
        <button 
          onClick={() => setShowToast(false)} 
          className="ml-2 text-gray-500 hover:text-white transition-colors p-1"
        >
          <XCircle size={16} />
        </button>
      </div>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>}>
      <ConfirmedContent />
    </Suspense>
  );
}
