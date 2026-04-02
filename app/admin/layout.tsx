import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Car, CalendarDays, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-white">
      {/* Glassmorphism Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Bhopal Admin
        </h2>
        <nav className="space-y-4">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/cars" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
            <Car size={20} /> Manage Fleet
          </Link>
          <Link href="/admin/bookings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
            <CalendarDays size={20} /> Bookings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}