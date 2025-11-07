import Link from 'next/link';
import { GraduationCap, Users, BarChart3, QrCode, ArrowRight } from 'lucide-react';

export default function home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 shadow-lg shadow-blue-600/50">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">EduCore</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Modern Academic Management System for Teachers
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:shadow-xl hover:border-slate-600 transition">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <Users size={24} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Student Management
            </h3>
            <p className="text-slate-400 text-sm">
              Add, edit, and manage student records with ease
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:shadow-xl hover:border-slate-600 transition">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 size={24} className="text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Analytics Dashboard
            </h3>
            <p className="text-slate-400 text-sm">
              View class performance, GWA statistics, and insights
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:shadow-xl hover:border-slate-600 transition">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <QrCode size={24} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              QR Code Integration
            </h3>
            <p className="text-slate-400 text-sm">
              Quick access to student profiles via QR codes
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:shadow-xl hover:border-slate-600 transition">
            <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap size={24} className="text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Grade Tracking
            </h3>
            <p className="text-slate-400 text-sm">
              Track grades and auto-calculate GWA in real-time
            </p>
          </div>
        </div>
      </header>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-slate-400">
        <p>© 2025 EduCore. Academic Management System.</p>
      </footer>
    </div>
  );
}
