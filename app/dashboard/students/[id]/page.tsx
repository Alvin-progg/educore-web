"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, Edit2, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import AuthGuard from '@/app/components/AuthGuard';
import type { Student, Grade } from '@/lib/types';
import { getStudentById, getStudentGrades, deleteGrade } from '@/lib/api';
import AddGradeModal from '@/app/components/AddGradeModal';

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentCode = params.id as string; // This is actually student_code from the URL

  const [student, setStudent] = useState<Student | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);

  const fetchStudentData = async () => {
    try {
      const [studentData, gradesData] = await Promise.all([
        getStudentById(studentCode),
        getStudentGrades(studentCode),
      ]);
      setStudent(studentData);
      setGrades(gradesData);
    } catch (error) {
      toast.error('Failed to load student data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentCode]);

  const calculateGWA = () => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade.grade, 0);
    return sum / grades.length;
  };

  const handleDeleteGrade = async (gradeId: number) => {
    if (!confirm('Are you sure you want to delete this grade?')) return;

    try {
      await deleteGrade(String(gradeId));
      toast.success('Grade deleted successfully');
      fetchStudentData();
    } catch (error) {
      toast.error('Failed to delete grade');
      console.error(error);
    }
  };

  const handleEditGrade = (grade: Grade) => {
    setEditingGrade(grade);
    setIsModalOpen(true);
  };

  const handleGradeAdded = () => {
    fetchStudentData();
    setEditingGrade(null);
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

  const gwa = calculateGWA();
  
  // Parse the name field from backend (comes as single string)
  const nameParts = student.name?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`;
  
  // Determine GWA status
  const gwaColor = gwa <= 1.5 ? 'emerald' : gwa <= 2.0 ? 'blue' : gwa <= 2.5 ? 'amber' : 'orange';
  const gwaStatus = gwa <= 1.5 ? 'Excellent' : gwa <= 2.0 ? 'Very Good' : gwa <= 2.5 ? 'Good' : 'Fair';

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
              Back to Dashboard
            </button>
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/50">
                  <span className="text-white font-bold text-3xl">
                    {initials}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-800 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {firstName} {lastName}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    <span className="text-sm text-slate-400">ID:</span>
                    <span className="text-sm text-white font-semibold">{student.student_code}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 rounded-lg border border-slate-700">
                    <span className="text-sm text-slate-400">Course:</span>
                    <span className="text-sm text-indigo-300 font-semibold">{student.course_code || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* GWA Card */}
            <div className="lg:col-span-1">
              <div className={`relative overflow-hidden bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl`}>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">
                      General Weighted Average
                    </h2>
                    <span className={`px-3 py-1 bg-${gwaColor}-500/20 text-${gwaColor}-400 rounded-full text-xs font-bold border border-${gwaColor}-500/30`}>
                      {gwaStatus}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className={`text-6xl font-bold text-${gwaColor}-400 mb-2`}>
                      {gwa > 0 ? gwa.toFixed(2) : '0.00'}
                    </p>
                    <p className="text-sm text-slate-400">
                      Based on <span className="text-white font-semibold">{grades.length}</span> {grades.length === 1 ? 'subject' : 'subjects'}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Performance Level</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level}
                            className={`w-2 h-8 rounded-full ${
                              (gwa <= 1.5 && level <= 5) || 
                              (gwa <= 2.0 && level <= 4) || 
                              (gwa <= 2.5 && level <= 3) || 
                              (gwa <= 3.0 && level <= 2) || 
                              level <= 1
                                ? `bg-${gwaColor}-500` 
                                : 'bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`absolute top-0 right-0 w-40 h-40 bg-${gwaColor}-500/10 rounded-full blur-3xl`}></div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-slate-600 transition">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{grades.length}</p>
                    <p className="text-sm text-slate-400">Total Subjects</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-slate-600 transition">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {grades.filter(g => g.grade <= 1.5).length}
                    </p>
                    <p className="text-sm text-slate-400">Excellent Grades</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-slate-600 transition">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {grades.length > 0 ? Math.min(...grades.map(g => g.grade)).toFixed(2) : '0.00'}
                    </p>
                    <p className="text-sm text-slate-400">Highest Grade</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-slate-600 transition">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💯</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {grades.length > 0 ? Math.max(...grades.map(g => g.grade)).toFixed(2) : '0.00'}
                    </p>
                    <p className="text-sm text-slate-400">Lowest Grade</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grades Section */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-white">Academic Records</h2>
                <p className="text-sm text-slate-400 mt-1">Complete list of subject grades</p>
              </div>
              <button
                onClick={() => {
                  setEditingGrade(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow-lg shadow-indigo-600/30"
              >
                <Plus size={20} />
                Add Grade
              </button>
            </div>

            {grades.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📝</span>
                </div>
                <p className="text-slate-400 text-lg mb-2">No grades recorded yet</p>
                <p className="text-slate-500 text-sm">Add the first grade to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-slate-300 text-sm uppercase tracking-wider">Subject</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-300 text-sm uppercase tracking-wider">Grade</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-300 text-sm uppercase tracking-wider">Description</th>
                      <th className="text-right py-4 px-6 font-semibold text-slate-300 text-sm uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {grades.map((grade) => {
                      const gradeColor = grade.grade <= 1.5 ? 'emerald' : grade.grade <= 2.0 ? 'blue' : grade.grade <= 2.5 ? 'amber' : 'orange';
                      return (
                        <tr key={grade.id} className="hover:bg-slate-700/30 transition">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 bg-${gradeColor}-400 rounded-full`}></div>
                              <span className="text-white font-medium">{grade.subject_name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-3 py-1.5 bg-${gradeColor}-500/20 text-${gradeColor}-400 rounded-lg font-bold text-sm border border-${gradeColor}-500/30`}>
                              {grade.grade.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-400">
                            {grade.description || <span className="italic text-slate-500">No description</span>}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditGrade(grade)}
                                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition"
                                title="Edit Grade"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteGrade(grade.id)}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                                title="Delete Grade"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Add/Edit Grade Modal */}
        <AddGradeModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGrade(null);
          }}
          onGradeAdded={handleGradeAdded}
          studentId={studentCode}
          editingGrade={editingGrade}
        />
      </div>
    </AuthGuard>
  );
}
