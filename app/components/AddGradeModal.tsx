"use client";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { addGrade, updateGrade, getStudentById, getCourseSubjects } from '@/lib/api';
import type { AddGradeForm, Grade, CourseSubject } from '@/lib/types';
import { X } from 'lucide-react';

interface AddGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGradeAdded: () => void;
  studentId: string;
  editingGrade?: Grade | null;
}

export default function AddGradeModal({
  isOpen,
  onClose,
  onGradeAdded,
  studentId,
  editingGrade,
}: AddGradeModalProps) {
  const [formData, setFormData] = useState<AddGradeForm>({
    studentId: studentId,
    subject: '',
    grade: 0,
    semester: '',
  });
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<CourseSubject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [selectedSubjectName, setSelectedSubjectName] = useState('');

  // Fetch student's course subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!isOpen) return;
      
      setLoadingSubjects(true);
      try {
        const student = await getStudentById(studentId);
        if (student.course_code) {
          const courseSubjects = await getCourseSubjects(student.course_code);
          setSubjects(courseSubjects);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error('Failed to load subjects');
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [isOpen, studentId]);

  useEffect(() => {
    if (editingGrade) {
      setFormData({
        studentId: editingGrade.student_code,
        subject: editingGrade.subject_code,
        grade: editingGrade.grade,
        semester: '',
      });
      setSelectedSubjectName(editingGrade.subject_name);
    } else {
      setFormData({
        studentId: studentId,
        subject: '',
        grade: 0,
        semester: '',
      });
      setSelectedSubjectName('');
    }
  }, [editingGrade, studentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingGrade) {
        await updateGrade(String(editingGrade.id), formData);
        toast.success('Grade updated successfully!');
      } else {
        await addGrade(formData);
        toast.success('Grade added successfully!');
      }
      setFormData({ studentId: studentId, subject: '', grade: 0, semester: '' });
      setSelectedSubjectName('');
      onGradeAdded();
      onClose();
    } catch (error) {
      toast.error(`Failed to ${editingGrade ? 'update' : 'add'} grade. Please try again.`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (subjectCode: string) => {
    const subject = subjects.find(s => s.subject_code === subjectCode);
    setFormData({ ...formData, subject: subjectCode });
    setSelectedSubjectName(subject?.subject_name || '');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingGrade ? 'Edit Grade' : 'Add New Grade'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            {loadingSubjects ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500">
                Loading subjects...
              </div>
            ) : subjects.length > 0 ? (
              <select
                value={formData.subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.subject_code}>
                    {subject.subject_name} ({subject.subject_code})
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500">
                No subjects available for this course
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade (1.0 - 5.0)
            </label>
            <input
              type="number"
              step="0.01"
              min="1.0"
              max="5.0"
              value={formData.grade || ''}
              onChange={(e) => setFormData({ ...formData, grade: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Philippine grading system: 1.0 (highest) to 5.0 (lowest)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={formData.semester || ''}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Midterm, Final, 1st Semester"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
              disabled={loading || loadingSubjects}
            >
              {loading ? 'Saving...' : editingGrade ? 'Update Grade' : 'Add Grade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
