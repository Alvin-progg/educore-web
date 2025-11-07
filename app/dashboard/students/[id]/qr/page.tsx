"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download, User } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import AuthGuard from '@/app/components/AuthGuard';
import type { Student } from '@/lib/types';
import { getStudentById } from '@/lib/api';

export default function StudentQRPage() {
  const params = useParams();
  const router = useRouter();
  const studentCode = params.id as string; // This is actually student_code from the URL

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudentById(studentCode);
        setStudent(data);
      } catch (error) {
        toast.error('Failed to load student data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentCode]);

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code');
    if (!svg || !student) return;

    // Parse the name field from backend (comes as single string)
    const nameParts = student.name?.split(' ') || [];
    const firstName = nameParts[0] || 'Student';
    const lastName = nameParts.slice(1).join(' ') || '';
    const fullName = `${firstName}-${lastName}`.replace(/\s+/g, '-');

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `${fullName}-QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex justify-center items-center h-screen bg-slate-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </AuthGuard>
    );
  }

  if (!student) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <User size={40} className="text-slate-500" />
            </div>
            <p className="text-slate-400 text-lg">Student not found</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Parse the name field from backend (comes as single string)
  const nameParts = student.name?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`;

  // Generate URL for QR code - this should point to the student's profile
  const profileUrl = `${window.location.origin}/dashboard/students/${studentCode}`;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-6 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/50">
                <span className="text-white font-bold text-2xl">
                  {initials}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {firstName} {lastName}
                </h1>
                <p className="text-indigo-300 font-medium">Student QR Code</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
            <div className="text-center p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">
                  Student QR Code
                </h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  Scan this QR code to quickly access the student's profile and academic records
                </p>
              </div>

              {/* QR Code Display with enhanced styling */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  {/* Decorative corners */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg"></div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg"></div>
                  <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg"></div>
                  <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-lg"></div>
                  
                  {/* QR Code container */}
                  <div className="relative p-8 bg-white rounded-2xl shadow-2xl">
                    <QRCodeSVG
                      id="qr-code"
                      value={profileUrl}
                      size={280}
                      level="H"
                      includeMargin={true}
                      fgColor="#1e293b"
                      bgColor="#ffffff"
                    />
                  </div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-indigo-500/20 blur-3xl -z-10"></div>
                </div>
              </div>

              {/* Student Info Card */}
              <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-6 mb-8 max-w-md mx-auto">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">
                      {initials}
                    </span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-white text-lg">
                      {firstName} {lastName}
                    </h3>
                    <p className="text-slate-400 text-sm">{student.student_code}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Course</span>
                    <span className="text-indigo-300 font-semibold">{student.course_code || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={downloadQRCode}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
                >
                  <Download size={20} />
                  Download QR Code
                </button>
                <button
                  onClick={() => router.push(`/dashboard/students/${studentCode}`)}
                  className="px-8 py-3.5 bg-slate-700 border border-slate-600 text-white rounded-xl hover:bg-slate-600 transition font-semibold"
                >
                  View Profile
                </button>
              </div>

              {/* Instructions */}
              <div className="text-left bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-6 max-w-2xl mx-auto">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">How to use this QR Code</h4>
                    <p className="text-sm text-slate-400">Follow these simple steps to access the profile</p>
                  </div>
                </div>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full text-xs font-bold shrink-0 mt-0.5">1</span>
                    <span className="text-sm text-slate-300">Download or print this QR code for easy access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full text-xs font-bold shrink-0 mt-0.5">2</span>
                    <span className="text-sm text-slate-300">Use any QR scanner app on your smartphone or tablet</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full text-xs font-bold shrink-0 mt-0.5">3</span>
                    <span className="text-sm text-slate-300">Scan the code to instantly open this student's profile</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full text-xs font-bold shrink-0 mt-0.5">4</span>
                    <span className="text-sm text-slate-300">View grades, GWA, and manage all academic records</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
