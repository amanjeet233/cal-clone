// src/app/bookings/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format, isPast, isFuture } from "date-fns";
import { Calendar, Clock, Mail, User, XCircle, CheckCircle, AlertCircle, CalendarClock } from "lucide-react";

function BookingCard({ booking, onCancel }) {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  const isPastBooking = isPast(endTime);
  const isCancelled = booking.status === "cancelled";

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 ${
        isCancelled
          ? "border-gray-200 opacity-60"
          : isPastBooking
          ? "border-gray-200"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className="p-5">
        {/* Status indicator + Event type */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5"
              style={{
                backgroundColor: isCancelled
                  ? "#9ca3af"
                  : isPastBooking
                  ? "#d1d5db"
                  : booking.eventType?.color || "#0ea5e9",
              }}
            />
            <span className="text-sm font-semibold text-gray-900">
              {booking.eventType?.title || "Event"}
            </span>
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isCancelled
                ? "bg-gray-100 text-gray-500"
                : isPastBooking
                ? "bg-gray-100 text-gray-500"
                : "bg-green-50 text-green-700"
            }`}
          >
            {isCancelled ? "Cancelled" : isPastBooking ? "Completed" : "Upcoming"}
          </span>
        </div>

        {/* Date & time */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={14} className="text-gray-400 flex-shrink-0" />
            <span>{format(startTime, "EEEE, MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={14} className="text-gray-400 flex-shrink-0" />
            <span>
              {format(startTime, "h:mm a")} – {format(endTime, "h:mm a")}
            </span>
            <span className="text-gray-400">
              ({booking.eventType?.duration} min)
            </span>
          </div>
        </div>

        {/* Booker info */}
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={14} className="text-gray-400 flex-shrink-0" />
            <span>{booking.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail size={14} className="text-gray-400 flex-shrink-0" />
            <a
              href={`mailto:${booking.email}`}
              className="hover:text-sky-600 transition-colors"
            >
              {booking.email}
            </a>
          </div>
          {booking.notes && (
            <div className="mt-2 px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-500 italic">
              "{booking.notes}"
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {!isCancelled && !isPastBooking && (
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-3">
          <Link
            href={`/${booking.eventType?.slug}?reschedule=${booking.id}`}
            className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 transition-colors font-medium"
          >
            <CalendarClock size={13} />
            Reschedule
          </Link>
          <button
            onClick={() => onCancel(booking.id)}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
          >
            <XCircle size={13} />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming"); // "upcoming" | "past"

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    if (!confirm("Cancel this booking?")) return;
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      console.error("Failed to cancel:", err);
    }
  }

  const now = new Date();

  const upcomingBookings = bookings.filter(
    (b) => b.status !== "cancelled" && new Date(b.endTime) > now
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "cancelled" || new Date(b.endTime) <= now
  );

  const displayedBookings = tab === "upcoming" ? upcomingBookings : pastBookings;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your scheduled meetings.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-8">
        <div className="flex gap-1">
          {[
            { key: "upcoming", label: "Upcoming", count: upcomingBookings.length },
            { key: "past", label: "Past", count: pastBookings.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  tab === t.key
                    ? "bg-sky-100 text-sky-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Booking list */}
      <div className="px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 h-52 animate-pulse"
              />
            ))}
          </div>
        ) : displayedBookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {tab === "upcoming" ? (
                <Calendar size={28} className="text-gray-400" />
              ) : (
                <CheckCircle size={28} className="text-gray-400" />
              )}
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">
              No {tab} bookings
            </h3>
            <p className="text-sm text-gray-400">
              {tab === "upcoming"
                ? "Share your booking link to start receiving meetings."
                : "Your completed and cancelled bookings will appear here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayedBookings
              .sort(
                (a, b) =>
                  new Date(a.startTime).getTime() -
                  new Date(b.startTime).getTime()
              )
              .map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancel}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
