// src/app/event-types/new/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Link2, Palette } from "lucide-react";

const COLORS = [
  "#0ea5e9", // sky
  "#8b5cf6", // violet
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

const DURATIONS = [15, 30, 45, 60, 90, 120];

export default function NewEventTypePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: 30,
    slug: "",
    color: "#0ea5e9",
  });

  function handleTitleChange(e) {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setForm((prev) => ({ ...prev, title, slug }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.title || !form.slug) {
      setError("Title and URL slug are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/event-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create event type");
        return;
      }
      router.push("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              New Event Type
            </h1>
            <p className="text-sm text-gray-500">
              Create a new event for people to book
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Basic Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. 30 Minute Meeting"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what this event is about..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow resize-none"
                />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={15} className="text-gray-400" />
              Duration
            </h2>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, duration: d }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    form.duration === d
                      ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:border-sky-300 hover:text-sky-600"
                  }`}
                >
                  {d} min
                </button>
              ))}
              {/* Custom duration */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">or</span>
                <input
                  type="number"
                  min={5}
                  max={480}
                  step={5}
                  placeholder="Custom"
                  value={!DURATIONS.includes(form.duration) ? form.duration : ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 30,
                    }))
                  }
                  className="w-24 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-500">min</span>
              </div>
            </div>
          </div>

          {/* URL Slug */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Link2 size={15} className="text-gray-400" />
              Booking URL
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500 whitespace-nowrap">
                  {typeof window !== "undefined" ? window.location.origin : ""}/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, ""),
                    }))
                  }
                  placeholder="30min"
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
                  required
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-400">
                Only lowercase letters, numbers, and hyphens
              </p>
            </div>
          </div>

          {/* Color */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Palette size={15} className="text-gray-400" />
              Color
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                  className={`w-8 h-8 rounded-full transition-all ${
                    form.color === c
                      ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              {loading ? "Creating..." : "Create Event Type"}
            </button>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
