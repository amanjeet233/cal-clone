// src/app/availability/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Clock, Globe, Check, Save } from "lucide-react";

const DAYS = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

const TIMEZONES = [
  "Asia/Kolkata",
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Australia/Sydney",
];

// Generate time options in 30-min increments
function generateTimeOptions() {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const ampm = h >= 12 ? "PM" : "AM";
      const hour = h % 12 || 12;
      const label = `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
      options.push({ value: time, label });
    }
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

export default function AvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    timezone: "Asia/Kolkata",
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
    startTime: "09:00",
    endTime: "17:00",
  });

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch("/api/availability");
        const data = await res.json();
        if (data && data.id) {
          setForm({
            timezone: data.timezone,
            monday: data.monday,
            tuesday: data.tuesday,
            wednesday: data.wednesday,
            thursday: data.thursday,
            friday: data.friday,
            saturday: data.saturday,
            sunday: data.sunday,
            startTime: data.startTime,
            endTime: data.endTime,
          });
        }
      } catch (err) {
        console.error("Failed to load availability:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  }

  function toggleDay(day) {
    setForm((prev) => ({ ...prev, [day]: !prev[day] }));
  }

  const activeDaysCount = DAYS.filter((d) => form[d.key]).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
            <p className="mt-1 text-sm text-gray-500">
              Set when you're available for bookings each week.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
              saved
                ? "bg-green-500 text-white"
                : "bg-zinc-900 hover:bg-black text-white disabled:opacity-60"
            }`}
          >
            {saved ? (
              <>
                <Check size={15} /> Saved!
              </>
            ) : (
              <>
                <Save size={15} />
                {saving ? "Saving..." : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 max-w-2xl space-y-6">
        {/* Timezone */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe size={15} className="text-gray-400" />
            Timezone
          </h2>
          <select
            value={form.timezone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, timezone: e.target.value }))
            }
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Hours */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={15} className="text-gray-400" />
            Available Hours
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <select
                value={form.startTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, startTime: e.target.value }))
                }
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
              >
                {TIME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center pt-5 text-gray-400 font-medium">
              →
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <select
                value={form.endTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, endTime: e.target.value }))
                }
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent bg-white"
              >
                {TIME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Slots will be generated every 30 minutes within this window
          </p>
        </div>

        {/* Days */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Available Days
            </h2>
            <span className="text-xs text-gray-400">
              {activeDaysCount} day{activeDaysCount !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="space-y-2">
            {DAYS.map((day) => (
              <label
                key={day.key}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                  form[day.key]
                    ? "border-zinc-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      form[day.key]
                        ? "bg-zinc-900 border-zinc-900"
                        : "border-gray-300"
                    }`}
                  >
                    {form[day.key] && (
                      <Check size={12} className="text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      form[day.key] ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {day.label}
                  </span>
                </div>
                {form[day.key] && (
                  <span className="text-xs text-zinc-600 font-medium">
                    {form.startTime} – {form.endTime}
                  </span>
                )}
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form[day.key]}
                  onChange={() => toggleDay(day.key)}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
            saved
              ? "bg-green-500 text-white"
              : "bg-zinc-900 hover:bg-black text-white disabled:opacity-60"
          }`}
        >
          {saved ? "✓ Changes Saved!" : saving ? "Saving..." : "Save Availability"}
        </button>
      </div>
    </div>
  );
}
