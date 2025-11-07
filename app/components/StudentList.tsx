"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, QrCode, Trash2, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import type { Student } from '@/lib/types';
import { getAllStudents, deleteStudent } from '@/lib/api';

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (studentCode: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await deleteStudent(studentCode);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
      console.error(error);
    }
  };

  const handleViewProfile = (studentCode: string) => {
    router.push(`/dashboard/students/${studentCode}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-800 rounded-xl border border-slate-700">
        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-slate-400" />
        </div>
        <p className="text-white text-lg font-semibold">No students found</p>
        <p className="text-slate-400 text-sm mt-2">Add your first student to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {students.map((student) => {
        const nameParts = student.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        const initials = `${firstName[0] || ''}${lastName[0] || ''}`;
        
        // Determine GWA status color
        const gwaColor = student.gwa <= 1.5 ? 'emerald' : student.gwa <= 2.0 ? 'blue' : student.gwa <= 2.5 ? 'amber' : 'orange';
        
        return (
          <div
            key={student.id}
            className="bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all overflow-hidden group"
          >
            {/* Header with gradient */}
            <div className="bg-linear-to-br from-indigo-600/20 to-purple-600/20 p-6 border-b border-slate-700/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {initials}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-800"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">
                      {student.name}
                    </h3>
                    <p className="text-sm text-indigo-300 font-medium mt-0.5">{student.course_code}</p>
                  </div>
                </div>
              </div>

              {student.student_code && (
                <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  <p className="text-xs text-slate-400 font-medium">ID:</p>
                  <p className="text-sm text-slate-200 font-semibold">{student.student_code}</p>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-6">
              {student.gwa !== undefined && student.gwa > 0 ? (
                <div className={`relative overflow-hidden mb-4 px-5 py-4 bg-linear-to-br from-${gwaColor}-600/20 to-${gwaColor}-500/10 rounded-xl border border-${gwaColor}-500/30`}>
                  <div className="relative z-10">
                    <p className="text-xs text-slate-300 font-medium mb-1.5">General Weighted Average</p>
                    <div className="flex items-baseline gap-2">
                      <p className={`text-4xl font-bold text-${gwaColor}-400`}>{student.gwa.toFixed(2)}</p>
                      <span className={`text-xs font-semibold px-2 py-1 bg-${gwaColor}-500/20 text-${gwaColor}-300 rounded-full`}>
                        {student.gwa <= 1.5 ? 'Excellent' : student.gwa <= 2.0 ? 'Very Good' : student.gwa <= 2.5 ? 'Good' : 'Fair'}
                      </span>
                    </div>
                  </div>
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-${gwaColor}-500/10 rounded-full blur-2xl`}></div>
                </div>
              ) : (
                <div className="mb-4 px-5 py-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
                  <p className="text-sm text-slate-400">No GWA recorded yet</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewProfile(student.student_code)}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
                >
                  View Profile
                </button>
                <button
                  onClick={() => router.push(`/dashboard/students/${student.student_code}/qr`)}
                  className="px-3.5 py-2.5 bg-slate-700 hover:bg-slate-600 text-emerald-400 rounded-lg transition border border-slate-600"
                  title="View QR Code"
                >
                  <QrCode size={18} />
                </button>
                <button
                  onClick={() => handleDelete(student.student_code)}
                  className="px-3.5 py-2.5 bg-slate-700 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-lg transition border border-slate-600 hover:border-red-500/50"
                  title="Delete Student"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
