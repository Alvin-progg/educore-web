"use client";
import AuthGuard from "../components/AuthGuard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Plus, LogOut, Users, BarChart3, Menu, Search, GraduationCap } from "lucide-react";
import AddStudentModal from "../components/AddStudentModal";
import StudentList from "../components/StudentList";
import AnalyticsDashboard from "../components/AnalyticsDashboard";

type TabType = 'analytics' | 'students';

export default function DashboardPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('analytics');
    const [refreshKey, setRefreshKey] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace("/login");
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleStudentAdded = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <AuthGuard>
            <div className="flex h-screen bg-slate-900 overflow-hidden">
                {/* Sidebar */}
                <aside className={`bg-slate-800 border-r border-slate-700 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
                        {sidebarOpen ? (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/50">
                                    <GraduationCap size={24} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-white">EduCore</h1>
                                    <p className="text-xs text-slate-400">Academic System</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/50">
                                <GraduationCap size={24} className="text-white" />
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-6 space-y-1">
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                                activeTab === 'analytics'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                            }`}
                        >
                            <BarChart3 size={20} className="shrink-0" />
                            {sidebarOpen && <span className="font-medium text-sm">Analytics</span>}
                        </button>

                        <button
                            onClick={() => setActiveTab('students')}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                                activeTab === 'students'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                            }`}
                        >
                            <Users size={20} className="shrink-0" />
                            {sidebarOpen && <span className="font-medium text-sm">Students</span>}
                        </button>
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-slate-700">
                        {sidebarOpen ? (
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center shrink-0 ring-2 ring-indigo-600/30">
                                    <span className="text-indigo-400 font-semibold text-sm">
                                        {auth.currentUser?.email?.[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {auth.currentUser?.email?.split('@')[0]}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">Teacher</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-3 ring-2 ring-indigo-600/30">
                                <span className="text-indigo-400 font-semibold text-sm">
                                    {auth.currentUser?.email?.[0].toUpperCase()}
                                </span>
                            </div>
                        )}
                        
                        <button
                            onClick={handleSignOut}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-600/20 hover:text-red-400 transition text-sm font-medium ${
                                !sidebarOpen && 'justify-center'
                            }`}
                        >
                            <LogOut size={18} className="shrink-0" />
                            {sidebarOpen && <span>Sign Out</span>}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Header */}
                    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-8">
                        <div className="flex items-center gap-4">
                            {/* Toggle Button */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="w-10 h-10 bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-all"
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {activeTab === 'analytics' ? 'Analytics Dashboard' : 'Student Management'}
                                </h2>
                                <p className="text-sm text-slate-400">
                                    {activeTab === 'analytics' 
                                        ? 'Overview of your class performance' 
                                        : 'Manage and track student records'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {activeTab === 'students' && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 font-medium text-sm"
                                >
                                    <Plus size={18} />
                                    Add Student
                                </button>
                            )}
                        </div>
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 overflow-y-auto p-8 bg-slate-900">
                        {activeTab === 'analytics' && (
                            <AnalyticsDashboard key={refreshKey} />
                        )}

                        {activeTab === 'students' && (
                            <StudentList key={refreshKey} />
                        )}
                    </main>
                </div>

                {/* Add Student Modal */}
                <AddStudentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onStudentAdded={handleStudentAdded}
                />
            </div>
        </AuthGuard>
    );
}
