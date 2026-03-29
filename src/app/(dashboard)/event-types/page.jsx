// src/app/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Clock,
  Link2,
  Edit2,
  Trash2,
  Copy,
  Check,
  MoreVertical,
  ExternalLink,
  Zap,
} from "lucide-react";

function EventTypeCard({ eventType, onDelete, onCopy }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const bookingUrl = `${window.location.origin}/${eventType.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  const colorDot = eventType.color || "#111827";

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: colorDot }}
        />
        <div className="flex flex-col min-w-0">
          <Link href={`/event-types/${eventType.id}/edit`} className="font-semibold text-gray-900 text-sm hover:underline truncate">
            {eventType.title}
          </Link>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
            <span className="truncate">/{eventType.slug}</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5"><Clock size={12} className="text-gray-400" /> {eventType.duration}m</span>
            {eventType.description && (
              <>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="truncate hidden sm:inline text-gray-400">{eventType.description}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
        <button
          onClick={handleCopy}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {copied ? <Check size={14} className="text-green-600" /> : <Link2 size={14} className="text-gray-500" />}
          {copied ? "Copied" : "Copy link"}
        </button>

        {/* Fake toggle switch for aesthetics */}
        <div className="hidden sm:flex items-center justify-center">
          <div className="bg-gray-900 rounded-full relative cursor-pointer" style={{ height: '20px', width: '36px' }}>
             <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 transition-colors border border-transparent hover:border-gray-200"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-9 w-48 bg-white rounded-md border border-gray-200 shadow-lg py-1 z-20">
                <Link
                  href={`/event-types/${eventType.id}/edit`}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                  onClick={() => setShowMenu(false)}
                >
                  <Edit2 size={14} className="text-gray-500" /> Edit
                </Link>
                <Link
                  href={`/${eventType.slug}`}
                  target="_blank"
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                  onClick={() => setShowMenu(false)}
                >
                  <ExternalLink size={14} className="text-gray-500" /> Preview
                </Link>
                <div className="h-px bg-gray-200 my-1"></div>
                <button
                  onClick={() => {
                    handleCopy();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                >
                  <Link2 size={14} className="text-gray-500" /> Copy link
                </button>
                <div className="h-px bg-gray-200 my-1"></div>
                <button
                  onClick={() => {
                    onDelete(eventType.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                >
                  <Trash2 size={14} className="text-red-500" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchEventTypes();
  }, []);

  async function fetchEventTypes() {
    try {
      const res = await fetch("/api/event-types");
      const data = await res.json();
      setEventTypes(data);
    } catch (err) {
      console.error("Failed to fetch event types:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this event type? All associated bookings will also be deleted.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/event-types/${id}`, { method: "DELETE" });
      setEventTypes((prev) => prev.filter((et) => et.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create events to share for people to book on your calendar.
              </p>
            </div>
            <Link
              href="/event-types/new"
              className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              <Plus size={16} />
              New
            </Link>
          </div>

          {/* Content */}
          <div>
            {loading ? (
              <div className="bg-white rounded-md border border-gray-200 divide-y divide-gray-200">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 h-[72px] bg-gray-50 animate-pulse"
                  />
                ))}
              </div>
            ) : eventTypes.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-200 rounded-md">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 shadow-sm">
                  <Link2 size={20} className="text-zinc-900" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  No event types yet
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  Create your first event type and share the link to
                  start receiving bookings.
                </p>
                <Link
                  href="/event-types/new"
                  className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  New
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-md border border-gray-200 divide-y divide-gray-200 overflow-hidden shadow-sm">
                {eventTypes.map((et) => (
                  <EventTypeCard
                    key={et.id}
                    eventType={et}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
