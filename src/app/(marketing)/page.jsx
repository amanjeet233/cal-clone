"use client";

import Link from "next/link";
import { ChevronRight, Calendar as CalendarIcon, Clock, Video, Globe2, Info } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-gray-200">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-bold text-2xl tracking-tight">
            Cal.com
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="#" className="hover:text-black transition-colors flex items-center gap-1">Solutions <ChevronRight size={14} className="rotate-90 opacity-60" /></Link>
            <Link href="#" className="hover:text-black transition-colors">Enterprise</Link>
            <Link href="#" className="hover:text-black transition-colors">Cal.ai</Link>
            <Link href="#" className="hover:text-black transition-colors flex items-center gap-1">Developer <ChevronRight size={14} className="rotate-90 opacity-60" /></Link>
            <Link href="#" className="hover:text-black transition-colors flex items-center gap-1">Resources <ChevronRight size={14} className="rotate-90 opacity-60" /></Link>
            <Link href="#" className="hover:text-black transition-colors">Pricing</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/event-types" className="text-sm font-semibold hover:text-gray-600 transition-colors">
            Sign in
          </Link>
          <Link href="/event-types" className="bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-1">
            Get started <ChevronRight size={16} />
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-10 pb-20">
        {/* Announcement Banner */}
        <div className="bg-[#eff2fc] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between mb-16 shadow-sm border border-[#e5e9fa]">
          <div className="flex items-center gap-3 text-sm text-[#465fbb] font-medium">
            <span className="bg-[#465fbb] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">i</span>
            Moving from Clockwise? - Set a priority call with our team today!
          </div>
          <button className="bg-[#3b5bdb] hover:bg-[#3451c2] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors mt-4 sm:mt-0 flex items-center gap-1">
            Book a demo <ChevronRight size={16} />
          </button>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Hero Text */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium mb-8 transition-colors border border-gray-200">
              Cal.com launches v6.3 <ChevronRight size={14} className="opacity-60" />
            </div>
            
            <h1 className="text-6xl md:text-[5rem] font-extrabold leading-[1.05] tracking-tight mb-8">
              The better way to schedule your meetings
            </h1>
            
            <p className="text-xl text-gray-500 leading-relaxed mb-10 w-11/12">
              A fully customizable scheduling software for individuals, businesses taking calls and developers building scheduling platforms where users meet users.
            </p>
          </div>

          {/* Right Hero Widget Mockup */}
          <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 relative overflow-hidden transform lg:scale-105 origin-top-left xl:-mr-12">
            
            {/* Widget Left Details */}
            <div className="pr-6 border-r border-gray-100">
              <div className="w-12 h-12 rounded-full overflow-hidden mb-4 border border-gray-200 bg-gray-50">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=cedric&backgroundColor=f3f4f6`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <p className="text-gray-500 font-medium mb-1">Cédric van Ravesteijn</p>
              <h2 className="text-2xl font-bold mb-4">Partnerships Meeting</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Are you an agency, influencer, SaaS founder, or business looking to collaborate with Cal.com? Let's chat!
              </p>
              
              <div className="space-y-4 text-sm font-medium text-gray-700">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-gray-400" />
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    <span className="bg-white shadow-sm rounded-md px-3 py-1 border border-gray-200 cursor-pointer">15m</span>
                    <span className="px-3 py-1 text-gray-500 hover:text-gray-900 cursor-pointer">30m</span>
                    <span className="px-3 py-1 text-gray-500 hover:text-gray-900 cursor-pointer">45m</span>
                    <span className="px-3 py-1 text-gray-500 hover:text-gray-900 cursor-pointer">1h</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Video size={16} className="text-gray-400" />
                  Cal Video
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe2 size={16} className="text-gray-400" />
                  <span className="flex items-center gap-1 cursor-pointer">
                    Europe/Amsterdam <ChevronRight size={14} className="rotate-90 opacity-60" />
                  </span>
                </div>
              </div>
            </div>

            {/* Widget Right Calendar */}
            <div className="pt-2 pl-2">
              <h3 className="font-semibold text-lg mb-6">May <span className="text-gray-400 font-normal">2025</span></h3>
              
              <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-sm">
                {/* Days header */}
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="text-[10px] font-semibold text-gray-400 tracking-wider mb-2">{day}</div>
                ))}
                
                {/* Empty slots for May start */}
                <div className="p-2"></div>
                <div className="p-2"></div>
                <div className="p-2"></div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">1</div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">2</div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">3</div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">4</div>
                
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">5</div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">6</div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">7</div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">8</div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">9</div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">10</div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">11</div>
                
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">12</div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">13</div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">14</div>
                <div className="col-span-1 p-2 bg-zinc-900 text-white shadow-sm rounded-lg font-semibold relative cursor-pointer">
                  15
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                </div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">16</div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">17</div>
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">18</div>
                
                <div className="col-span-1 p-2 bg-gray-50 rounded-lg text-gray-900 font-semibold cursor-pointer hover:bg-gray-100">19</div>
                <div className="col-span-1 p-2 bg-gray-200 rounded-lg text-gray-900 font-semibold cursor-pointer border border-gray-300">20</div>
                <div className="col-span-1 p-2 bg-gray-200 rounded-lg text-gray-900 font-semibold cursor-pointer border border-gray-300">21</div>
                <div className="col-span-1 p-2 bg-gray-200 rounded-lg text-gray-900 font-semibold cursor-pointer border border-gray-300">22</div>
                <div className="col-span-1 p-2 bg-gray-200 rounded-lg text-gray-900 font-semibold cursor-pointer border border-gray-300">23</div>
                <div className="col-span-1 p-2 bg-gray-200 rounded-lg text-gray-900 font-semibold cursor-pointer border border-gray-300">24</div>
                <div className="col-span-1 p-2 bg-gray-200 rounded-lg text-gray-900 font-semibold cursor-pointer border border-gray-300">25</div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
