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

  const colorDot = eventType.color || "#0ea5e9";

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
              style={{ backgroundColor: colorDot }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base leading-tight">
                {eventType.title}
              </h3>
              {eventType.description && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {eventType.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Clock size={13} className="text-gray-400" />
                  {eventType.duration} minutes
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-400 truncate">
                  <Link2 size={13} />
                  <span className="truncate">/{eventType.slug}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="relative flex-shrink-0 ml-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-9 w-48 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-20">
                  <Link
                    href={`/${eventType.slug}`}
                    target="_blank"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowMenu(false)}
                  >
                    <ExternalLink size={14} /> Preview booking page
                  </Link>
                  <button
                    onClick={() => {
                      handleCopy();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Copy size={14} /> Copy booking link
                  </button>
                  <Link
                    href={`/event-types/${eventType.id}/edit`}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowMenu(false)}
                  >
                    <Edit2 size={14} /> Edit
                  </Link>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        onDelete(eventType.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer with copy link */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-sky-600 transition-colors"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-500" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span className="truncate max-w-[200px]">
                {bookingUrl}
              </span>
            </>
          )}
        </button>
        <Link
          href={`/event-types/${eventType.id}/edit`}
          className="text-xs font-medium text-sky-600 hover:text-sky-700 transition-colors"
        >
          Edit
        </Link>
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create events that people can book on your calendar.
            </p>
          </div>
          <Link
            href="/event-types/new"
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={16} />
            New Event Type
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 h-44 animate-pulse"
              />
            ))}
          </div>
        ) : eventTypes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap size={28} className="text-sky-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No event types yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Create your first event type and share the link with others to
              start receiving bookings.
            </p>
            <Link
              href="/event-types/new"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Create Event Type
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
  );
}
