"""
SQLAlchemy ORM Models for EduCore System
ALL TABLES NOW INCLUDE uid COLUMN FOR USER-SCOPED DATA ISOLATION
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Student(Base):
    """Student model with Firebase UID for user isolation"""
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uid = Column(String(128), nullable=False, index=True)  # Firebase UID - for filtering data per user
    student_code = Column(String(20), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    course_code = Column(String(20), ForeignKey("courses.code"), nullable=False)
    gwa = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Each user can have their own student with same student_code
    __table_args__ = (
        UniqueConstraint('uid', 'student_code', name='uq_uid_student_code'),
        Index('idx_uid_student_code', 'uid', 'student_code'),
    )
    
    # Relationships
    course = relationship("Course", back_populates="students")
    grades = relationship("Grade", back_populates="student", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Student(uid='{self.uid}', code='{self.student_code}', name='{self.name}')>"


class Course(Base):
    """Course model"""
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    students = relationship("Student", back_populates="course")
    subjects = relationship("CourseSubject", back_populates="course", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Course(code='{self.code}', name='{self.name}')>"


class CourseSubject(Base):
    """Course subjects mapping"""
    __tablename__ = "course_subjects"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    course_code = Column(String(20), ForeignKey("courses.code"), nullable=False)
    subject_code = Column(String(20), nullable=False)
    subject_name = Column(String(200), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Unique constraint for course_code and subject_code combination
    __table_args__ = (
        UniqueConstraint('course_code', 'subject_code', name='uq_course_subject'),
    )
    
    # Relationships
    course = relationship("Course", back_populates="subjects")
    
    def __repr__(self):
        return f"<CourseSubject(course='{self.course_code}', subject='{self.subject_code}')>"


class Grade(Base):
    """Grade model with Firebase UID for user isolation"""
    __tablename__ = "grades"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uid = Column(String(128), nullable=False, index=True)  # Firebase UID - for filtering data per user
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject_code = Column(String(20), nullable=False)
    subject_name = Column(String(200), nullable=False)
    grade = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Each user can have grades for their students
    __table_args__ = (
        UniqueConstraint('uid', 'student_id', 'subject_code', name='uq_uid_student_subject'),
        Index('idx_uid_student', 'uid', 'student_id'),
    )
    
    # Relationships
    student = relationship("Student", back_populates="grades")
    
    def __repr__(self):
        return f"<Grade(uid='{self.uid}', student_id={self.student_id}, subject='{self.subject_code}', grade={self.grade})>"
