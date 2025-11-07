# EduCore Backend API

FastAPI backend for the EduCore Academic Management System.

## Setup

1. **Install Python 3.8+**

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up MySQL database**
   - Install MySQL/MariaDB
   - Create database:
   ```sql
   CREATE DATABASE educore_db;
   ```

5. **Configure environment**
   - Copy `.env.example` to `.env`
   - Update database credentials

6. **Run the server**
   ```bash
   python main.py
   ```
   
   Or with uvicorn directly:
   ```bash
   uvicorn main:app --reload
   ```

7. **Access the API**
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `GET /api/students/{student_code}` - Get student by code
- `PUT /api/students/{student_code}` - Update student
- `DELETE /api/students/{student_code}` - Delete student
- `GET /api/students/{student_code}/qr-code` - Get QR code

### Grades
- `GET /api/grades/{student_code}` - Get student grades
- `POST /api/grades` - Add/update grade
- `PUT /api/grades/{grade_id}` - Update grade
- `DELETE /api/grades/{grade_id}` - Delete grade

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/{course_code}/subjects` - Get course subjects

### Analytics
- `GET /api/analytics/overview` - Get dashboard analytics
- `GET /api/gwa-report` - Get GWA report for all students

## Database Schema

### Students
- id (INT, PK, Auto)
- student_code (VARCHAR, Unique)
- name (VARCHAR)
- course_code (FK)
- gwa (FLOAT)
- created_at, updated_at

### Courses
- id (INT, PK, Auto)
- code (VARCHAR, Unique)
- name (VARCHAR)
- created_at

### CourseSubjects
- id (INT, PK, Auto)
- course_code (FK)
- subject_code (VARCHAR)
- subject_name (VARCHAR)
- created_at

### Grades
- id (INT, PK, Auto)
- student_code (FK)
- subject_code (VARCHAR)
- subject_name (VARCHAR)
- grade (FLOAT, 1.0-5.0)
- created_at, updated_at

## Pre-loaded Courses

- **BSIT** - Bachelor of Science in Information Technology
- **BSCS** - Bachelor of Science in Computer Science  
- **BSBA** - Bachelor of Science in Business Administration

Each with their respective subjects.
