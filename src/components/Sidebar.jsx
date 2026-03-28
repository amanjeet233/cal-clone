// src/components/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Clock,
  LayoutGrid,
  Settings,
  Users,
  Zap,
  ChevronDown,
  Plus,
} from "lucide-react";

const navItems = [
  {
    label: "Event Types",
    href: "/",
    icon: LayoutGrid,
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: Users,
  },
  {
    label: "Availability",
    href: "/availability",
    icon: Clock,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 flex flex-col z-40"
      style={{ backgroundColor: "#111827" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            CalSchedule
          </span>
        </div>
      </div>

      {/* User profile section */}
      <div className="px-3 py-4 border-b border-gray-800">
        <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-800 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            A
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-gray-100 truncate">
              Admin User
            </p>
            <p className="text-xs text-gray-400 truncate">
              admin@calschedule.com
            </p>
          </div>
          <ChevronDown size={14} className="text-gray-500 flex-shrink-0" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname.startsWith("/event-types")
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              }`}
            >
              <Icon
                size={17}
                className={isActive ? "text-sky-400" : "text-gray-500"}
              />
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400" />
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="pt-4 mt-2 border-t border-gray-800">
          <p className="px-3 pb-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Quick Actions
          </p>
          <Link
            href="/event-types/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-all duration-150"
          >
            <Plus size={17} className="text-gray-500" />
            New Event Type
          </Link>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 cursor-pointer hover:bg-gray-800 hover:text-gray-300 transition-colors">
          <Settings size={17} />
          <span>Settings</span>
        </div>
        <div className="mt-3 px-3">
          <div className="bg-gray-800 rounded-lg px-3 py-3">
            <p className="text-xs text-gray-400 leading-relaxed">
              Your public booking page:
            </p>
            <p className="text-xs text-sky-400 font-medium mt-1 truncate">
              {typeof window !== "undefined"
                ? window.location.origin
                : "http://localhost:3000"}
              /[slug]
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
