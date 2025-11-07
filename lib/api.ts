import axios from 'axios';
import type {
  Student,
  Grade,
  Analytics,
  ApiResponse,
  AddStudentForm,
  AddGradeForm,
} from './types';

// Configure the base URL for your FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include Firebase auth token
apiClient.interceptors.request.use(
  async (config) => {
    // You can add Firebase auth token here if needed
    // const token = await auth.currentUser?.getIdToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== STUDENT ENDPOINTS ====================

/**
 * Get all students
 */
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const response = await apiClient.get<Student[]>('/api/students');
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

/**
 * Get a single student by student code
 */
export const getStudentById = async (studentCode: string): Promise<Student> => {
  try {
    const response = await apiClient.get<Student>(`/api/students/${studentCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

/**
 * Add a new student
 */
export const addStudent = async (studentData: AddStudentForm): Promise<Student> => {
  try {
    const response = await apiClient.post<Student>('/api/students', {
      student_code: studentData.studentNumber || `STU-${Date.now()}`,
      name: `${studentData.firstName} ${studentData.lastName}`,
      course_code: studentData.courseCode || 'BSIT',
    });
    return response.data;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

/**
 * Update a student
 */
export const updateStudent = async (
  studentCode: string,
  studentData: Partial<AddStudentForm>
): Promise<Student> => {
  try {
    const response = await apiClient.put<Student>(
      `/api/students/${studentCode}`,
      {
        course_code: studentData.courseCode,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

/**
 * Delete a student
 */
export const deleteStudent = async (studentCode: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/students/${studentCode}`);
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// ==================== GRADE ENDPOINTS ====================

/**
 * Get grades for a specific student
 */
export const getStudentGrades = async (studentCode: string): Promise<Grade[]> => {
  try {
    const response = await apiClient.get<Grade[]>(`/api/grades/${studentCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student grades:', error);
    throw error;
  }
};

/**
 * Add a new grade for a student
 */
export const addGrade = async (gradeData: AddGradeForm): Promise<Grade> => {
  try {
    const response = await apiClient.post<Grade>('/api/grades', {
      student_code: gradeData.studentId,
      subject_code: gradeData.subject,
      subject_name: gradeData.subject,
      grade: gradeData.grade,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding grade:', error);
    throw error;
  }
};

/**
 * Update a grade
 */
export const updateGrade = async (
  gradeId: string,
  gradeData: Partial<AddGradeForm>
): Promise<Grade> => {
  try {
    const response = await apiClient.put<Grade>(`/api/grades/${gradeId}`, {
      student_code: gradeData.studentId,
      subject_code: gradeData.subject,
      subject_name: gradeData.subject,
      grade: gradeData.grade,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating grade:', error);
    throw error;
  }
};

/**
 * Delete a grade
 */
export const deleteGrade = async (gradeId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/grades/${gradeId}`);
  } catch (error) {
    console.error('Error deleting grade:', error);
    throw error;
  }
};

// ==================== ANALYTICS ENDPOINTS ====================

/**
 * Get analytics data
 */
export const getAnalytics = async (): Promise<Analytics> => {
  try {
    const response = await apiClient.get('/api/analytics/overview');
    const data = response.data;
    
    // Transform backend data to match frontend Analytics type
    return {
      totalStudents: data.total_students,
      averageGwa: data.overall_avg_gwa,
      gradeDistribution: data.grade_distribution.map((item: any) => ({
        range: item.range,
        count: item.count,
      })),
      topPerformers: data.top_students.map((student: any) => ({
        studentId: student.student_code,
        firstName: student.name.split(' ')[0] || '',
        lastName: student.name.split(' ').slice(1).join(' ') || '',
        gwa: student.gwa,
      })),
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

/**
 * Get student's GWA (General Weighted Average)
 */
export const getStudentGWA = async (studentCode: string): Promise<number> => {
  try {
    const student = await getStudentById(studentCode);
    return student.gwa || 0;
  } catch (error) {
    console.error('Error fetching student GWA:', error);
    throw error;
  }
};

// ==================== QR CODE ENDPOINTS ====================

/**
 * Get QR code data for a student
 */
export const getStudentQRCode = async (studentCode: string): Promise<string> => {
  try {
    const response = await apiClient.get(`/api/students/${studentCode}/qr-code`);
    return response.data.qr_data || response.data.profile_url;
  } catch (error) {
    console.error('Error fetching QR code:', error);
    throw error;
  }
};

// ==================== COURSE ENDPOINTS ====================

/**
 * Get all courses
 */
export const getAllCourses = async () => {
  try {
    const response = await apiClient.get('/api/courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

/**
 * Get subjects for a course
 */
export const getCourseSubjects = async (courseCode: string) => {
  try {
    const response = await apiClient.get(`/api/courses/${courseCode}/subjects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course subjects:', error);
    throw error;
  }
};

export default apiClient;
