// Student type definition
export interface Student {
  id: number;
  student_code: string;
  name: string;
  course_code: string;
  gwa: number;
  created_at?: string;
  updated_at?: string;
}

// Grade type definition
export interface Grade {
  id: number;
  student_code: string;
  subject_code: string;
  subject_name: string;
  grade: number;
  description?: string;
  formatted_grade?: string;
  created_at?: string;
  updated_at?: string;
}

// Analytics data types
export interface Analytics {
  totalStudents: number;
  averageGwa: number;
  gradeDistribution: GradeDistribution[];
  topPerformers: StudentPerformance[];
}

export interface GradeDistribution {
  range: string;
  count: number;
}

export interface StudentPerformance {
  studentId: string;
  firstName: string;
  lastName: string;
  gwa: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Form types
export interface AddStudentForm {
  firstName: string;
  lastName: string;
  email: string;
  studentNumber?: string;
  courseCode?: string;
}

export interface AddGradeForm {
  studentId: string;
  subject: string;
  grade: number;
  semester?: string;
}

// Course types
export interface Course {
  id: number;
  code: string;
  name: string;
  subjects?: CourseSubject[];
}

export interface CourseSubject {
  id: number;
  course_code: string;
  subject_code: string;
  subject_name: string;
}
