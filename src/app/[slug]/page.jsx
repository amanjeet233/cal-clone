// src/app/[slug]/page.jsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { format, isBefore, startOfDay } from "date-fns";
import {
  Clock,
  Globe,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  User,
  Mail,
  FileText,
  Video,
} from "lucide-react";

const get12HourTimeFormat = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
};

function BookingContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rescheduleId = searchParams.get("reschedule");
  const { slug } = params;

  const [eventType, setEventType] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState("calendar"); // "calendar" | "form"
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    notes: "",
  });

  const [rescheduleBooking, setRescheduleBooking] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [etRes, avRes] = await Promise.all([
          fetch(`/api/event-types?slug=${slug}`),
          fetch("/api/availability"),
        ]);
        const etData = await etRes.json();
        const avData = await avRes.json();

        if (!etData || etData.error || !etData.id) {
          setNotFound(true);
          return;
        }

        setEventType(etData);
        setAvailability(avData);

        if (rescheduleId) {
          try {
            const rbRes = await fetch(`/api/bookings/${rescheduleId}`);
            if (rbRes.ok) {
              const rbData = await rbRes.json();
              setRescheduleBooking(rbData);
              // Pre-fill form from original booking
              setForm({
                name: rbData.name,
                email: rbData.email,
                notes: rbData.notes || "",
              });
            }
          } catch (e) {
            console.error("Failed to fetch booking for reschedule", e);
          }
        }
      } catch (err) {
        setNotFound(true);
      }
    }
    loadData();
  }, [slug, rescheduleId]);

  useEffect(() => {
    if (!selectedDate || !eventType) return;
    fetchSlots(selectedDate);
  }, [selectedDate, eventType]);

  async function fetchSlots(date) {
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot(null);
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const res = await fetch(
        `/api/slots?date=${dateStr}&eventTypeId=${eventType.id}`
      );
      const data = await res.json();
      setSlots(data.slots || []);
    } catch (err) {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  async function handleBook() {
    if (!form.name || !form.email || !selectedSlot || !selectedDate) return;
    setSubmitting(true);
    setError("");

    try {
      const [h, m] = selectedSlot.split(":").map(Number);
      const startTime = new Date(selectedDate);
      startTime.setHours(h, m, 0, 0);
      const endTime = new Date(
        startTime.getTime() + eventType.duration * 60 * 1000
      );

      let res;
      if (rescheduleId) {
        res = await fetch(`/api/bookings/${rescheduleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            notes: form.notes,
          }),
        });
      } else {
        res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventTypeId: eventType.id,
            name: form.name,
            email: form.email,
            notes: form.notes,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to book. Please try again.");
        return;
      }

      router.push(`/${slug}/confirmed?bookingId=${data.id}${rescheduleId ? '&rescheduled=true' : ''}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Disable past dates and days not in availability
  function isDateDisabled(date) {
    if (!availability) return true;
    if (isBefore(date, startOfDay(new Date()))) return true;

    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = dayNames[date.getDay()];
    return !availability[dayName];
  }

  if (notFound) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        style={{ marginLeft: "-16rem" }}
      >
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Event not found
          </h1>
          <p className="text-gray-500 mb-6">
            This booking link doesn't exist or may have been removed.
          </p>
        </div>
      </div>
    );
  }

  if (!eventType) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        style={{ marginLeft: "-16rem" }}
      >
        <Loader2 size={24} className="text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    // Full-width public page - override the sidebar margin
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4"
      style={{ marginLeft: "-16rem" }}
    >
      <div className="w-full max-w-4xl">
        {/* Main booking card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[540px]">
            {/* Left Panel - Event Info */}
            <div className="md:w-80 flex-shrink-0 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-8">
              {/* Back button for step "form" */}
              {step === "form" && (
                <button
                  onClick={() => {
                    setStep("calendar");
                    setSelectedSlot(null);
                  }}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                >
                  <ArrowLeft size={15} />
                  Back
                </button>
              )}

              {/* Organizer avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-white text-lg font-bold mb-4">
                A
              </div>

              <p className="text-sm text-gray-500 mb-1">Admin User</p>
              <h1 className="text-xl font-bold text-gray-900 mb-3">
                {rescheduleId ? "Reschedule: " : ""}{eventType.title}
              </h1>

              {rescheduleBooking && (
                <div className="mb-4 bg-yellow-50 text-yellow-800 text-xs px-3 py-2 rounded border border-yellow-200">
                  Rescheduling original meeting on <strong>{format(new Date(rescheduleBooking.startTime), "MMM d, yyyy 'at' h:mm a")}</strong>.
                </div>
              )}

              {eventType.description && (
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  {eventType.description}
                </p>
              )}

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} className="text-gray-400" />
                  <span>{eventType.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Video size={14} className="text-gray-400" />
                  <span>Video call</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe size={14} className="text-gray-400" />
                  <span>{availability?.timezone || "Asia/Kolkata"}</span>
                </div>
              </div>

              {/* Selected date/time summary */}
              {selectedDate && step === "form" && selectedSlot && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <Calendar size={14} className="text-sky-500" />
                      <span>{format(selectedDate, "EEEE, MMMM d")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock size={14} className="text-sky-500" />
                      <span>
                        {get12HourTimeFormat(selectedSlot)} –{" "}
                        {(() => {
                          const [h, m] = selectedSlot.split(":").map(Number);
                          const totalMins = h * 60 + m + eventType.duration;
                          const eH = Math.floor(totalMins / 60);
                          const eM = totalMins % 60;
                          return get12HourTimeFormat(
                            `${String(eH).padStart(2, "0")}:${String(eM).padStart(2, "0")}`
                          );
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div className="flex-1 p-8">
              {step === "calendar" && (
                <>
                  <h2 className="text-base font-semibold text-gray-900 mb-6">
                    Select a Date & Time
                  </h2>

                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Calendar */}
                    <div className="flex-shrink-0">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={isDateDisabled}
                        fromDate={new Date()}
                      />
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-3">
                          {format(selectedDate, "EEEE, MMMM d")}
                        </p>

                        {loadingSlots ? (
                          <div className="flex items-center gap-2 text-gray-400 py-4">
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-sm">Loading slots...</span>
                          </div>
                        ) : slots.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-sm text-gray-400">
                              No available slots for this day.
                            </p>
                            <p className="text-xs text-gray-300 mt-1">
                              Try selecting another date.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {slots.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => {
                                  setSelectedSlot(slot);
                                  setStep("form");
                                }}
                                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border-2 border-sky-200 bg-sky-50 hover:bg-sky-500 hover:border-sky-500 hover:text-white text-sky-700 text-sm font-medium transition-all group"
                              >
                                <span>{get12HourTimeFormat(slot)}</span>
                                <ChevronRight
                                  size={14}
                                  className="opacity-50 group-hover:opacity-100"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {!selectedDate && (
                      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                        Select a date to see available times
                      </div>
                    )}
                  </div>
                </>
              )}

              {step === "form" && (
                <>
                  <h2 className="text-base font-semibold text-gray-900 mb-6">
                    Enter Your Details
                  </h2>

                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                      <AlertCircle size={15} />
                      {error}
                    </div>
                  )}

                  <div className="space-y-4 max-w-sm">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="John Doe"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="john@example.com"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Additional Notes{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <div className="relative">
                        <FileText
                          size={15}
                          className="absolute left-3 top-3 text-gray-400"
                        />
                        <textarea
                          value={form.notes}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              notes: e.target.value,
                            }))
                          }
                          placeholder="What would you like to discuss?"
                          rows={3}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleBook}
                      disabled={submitting || !form.name || !form.email}
                      className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          {rescheduleId ? "Rescheduling..." : "Booking..."}
                        </>
                      ) : (
                        rescheduleId ? "Confirm Reschedule" : "Confirm Booking"
                      )}
                    </button>

                    <p className="text-xs text-center text-gray-400">
                      By booking, you agree to share your information with the
                      event organizer.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by CalSchedule
        </p>
      </div>
    </div>
  );
}

export default function PublicBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-gray-400" /></div>}>
      <BookingContent />
    </Suspense>
  );
}
