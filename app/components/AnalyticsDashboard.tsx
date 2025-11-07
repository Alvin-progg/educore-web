"use client";
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Award, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import type { Analytics, Student } from '@/lib/types';
import { getAnalytics, getAllStudents } from '@/lib/api';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [analyticsData, studentsData] = await Promise.all([
          getAnalytics(),
          getAllStudents(),
        ]);
        setAnalytics(analyticsData);
        setStudents(studentsData);
      } catch (error) {
        toast.error('Failed to load analytics');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No analytics data available</p>
      </div>
    );
  }

  // Colors for charts and slices
  const COLORS = ['#60A5FA', '#7C3AED', '#34D399', '#F59E0B', '#F97316', '#EC4899', '#14B8A6'];

  // Calculate students by course from actual data
  const courseEnrollmentMap = students.reduce((acc, student) => {
    const course = student.course_code || 'Unassigned';
    acc[course] = (acc[course] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const courseEnrollmentData = Object.entries(courseEnrollmentMap)
    .map(([course, count]) => ({
      course,
      students: count,
    }))
    .sort((a, b) => b.students - a.students);

  // Create performance trend data - showing student count by grade range (actual data)
  const performanceTrendData = analytics.gradeDistribution.map((item) => ({
    range: item.range,
    students: item.count,
  }));

  // Map grade distribution for compatibility
  const pieData = analytics.gradeDistribution.map((item) => ({
    ...item,
    name: item.range,
    value: item.count,
  }));

  return (
    <div className="space-y-6 text-slate-100">
      {/* Stats Cards - dark modern style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-white">{analytics.totalStudents}</p>
              <p className="text-xs text-emerald-400 mt-2 font-medium">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-linear-to-br from-indigo-700 to-indigo-500 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Average GWA</p>
              <p className="text-3xl font-bold text-white">{analytics.averageGwa.toFixed(2)}</p>
              <p className="text-xs text-emerald-400 mt-2 font-medium">Excellent performance</p>
            </div>
            <div className="w-12 h-12 bg-linear-to-br from-emerald-700 to-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Top Performers</p>
              <p className="text-3xl font-bold text-white">{analytics.topPerformers.length}</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">Dean's list students</p>
            </div>
            <div className="w-12 h-12 bg-linear-to-br from-amber-600 to-amber-400 rounded-lg flex items-center justify-center">
              <Award size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Grade Ranges</p>
              <p className="text-3xl font-bold text-white">{analytics.gradeDistribution.length}</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">Distribution categories</p>
            </div>
            <div className="w-12 h-12 bg-linear-to-br from-violet-700 to-violet-500 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Distribution Bar */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Grade Distribution</h3>
            <p className="text-sm text-slate-400 mt-1">Overview of student performance</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
                labelStyle={{ color: '#e2e8f0' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="count" fill="#60A5FA" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Trend - Line chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Performance Trend</h3>
            <p className="text-sm text-slate-400 mt-1">Student count by grade range</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={performanceTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
                labelStyle={{ color: '#e2e8f0' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Line type="monotone" dataKey="students" stroke="#60A5FA" strokeWidth={3} dot={{ fill: '#60A5FA', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Students by Course - Horizontal Bar chart with actual data */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Students by Course</h3>
            <p className="text-sm text-slate-400 mt-1">Enrollment per course program</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={courseEnrollmentData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis dataKey="course" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
                labelStyle={{ color: '#e2e8f0' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="students" radius={[0, 8, 8, 0]} name="Students">
                {courseEnrollmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top performers list - slightly restyled for dark theme */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Top Performers</h3>
          <p className="text-sm text-slate-400 mt-1">Highest achieving students</p>
        </div>
        {analytics.topPerformers.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No top performers yet</p>
        ) : (
          <div className="space-y-3">
            {analytics.topPerformers.slice(0, 8).map((student, index) => (
              <div
                key={student.studentId}
                className="flex items-center justify-between p-4 bg-slate-900/40 rounded-lg hover:bg-slate-900/60 transition"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-amber-500 text-white' :
                    index === 1 ? 'bg-slate-600 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-indigo-600 text-white'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs text-slate-400">ID: {student.studentId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-400">{student.gwa.toFixed(2)}</p>
                  <p className="text-xs text-slate-400">GWA</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
