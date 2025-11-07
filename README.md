# EduCore Web App MVP

A modern, teacher-focused academic management system built with Next.js, Firebase Authentication, and FastAPI backend integration.

## 🚀 Features

### ✅ Complete MVP Functionality

- **🔐 Secure Authentication**: Firebase Authentication with login/register flows
- **👥 Student Management**: Add, view, edit, and delete student records
- **📊 Analytics Dashboard**: Real-time insights with visual charts
  - Total students count
  - Average GWA calculation
  - Grade distribution visualization
  - Top performers leaderboard
- **📝 Grade Management**: Add and update grades per subject with automatic GWA calculation
- **📱 QR Code Integration**: Generate and scan QR codes for quick student profile access
- **🎨 Modern UI**: Clean, professional design with indigo and white color palette
- **📐 Responsive Layout**: Sidebar navigation with collapsible menu

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Firebase Auth
- **Charts**: Recharts
- **QR Codes**: qrcode.react
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: Sonner

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase project created
- FastAPI backend running (see backend requirements below)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alvin-progg/educore-web.git
   cd educore-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Firebase configuration and API URL:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔌 Backend API Requirements

The app expects a FastAPI backend with the following endpoints:

### Students Endpoints
- `GET /students` - Get all students
- `GET /students/{id}` - Get student by ID
- `POST /students` - Create new student
- `PUT /students/{id}` - Update student
- `DELETE /students/{id}` - Delete student
- `GET /students/{id}/gwa` - Get student's GWA
- `GET /students/{id}/qr-code` - Get student's QR code

### Grades Endpoints
- `GET /students/{id}/grades` - Get student's grades
- `POST /grades` - Add new grade
- `PUT /grades/{id}` - Update grade
- `DELETE /grades/{id}` - Delete grade

### Analytics Endpoint
- `GET /analytics` - Get dashboard analytics

### Expected Response Format
```typescript
{
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

## 📁 Project Structure

```
educore-web/
├── app/
│   ├── components/          # Reusable components
│   │   ├── AddGradeModal.tsx
│   │   ├── AddStudentModal.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── AuthGuard.tsx
│   │   └── StudentList.tsx
│   ├── dashboard/           # Dashboard pages
│   │   ├── students/[id]/   # Dynamic student routes
│   │   │   ├── page.tsx     # Student profile
│   │   │   └── qr/
│   │   │       └── page.tsx # QR code page
│   │   └── page.tsx         # Main dashboard
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx             # Landing page
│   └── globals.css
├── lib/
│   ├── api.ts               # API client functions
│   ├── firebase.ts          # Firebase configuration
│   └── types.ts             # TypeScript types
├── public/
├── .env.example
├── package.json
└── README.md
```

## 🎯 Key Features Explained

### Authentication
- Teachers can register and log in using email/password
- Protected routes with AuthGuard component
- Automatic redirect to login if not authenticated

### Student Management
- Add students with name, email, and optional student ID
- View all students in card layout
- Click to view detailed student profile
- Delete students with confirmation

### Grades & GWA
- Add grades per subject (1.0 - 5.0 scale)
- Automatic GWA calculation
- Real-time updates
- Edit and delete grades

### Analytics Dashboard
- Visual statistics cards
- Bar chart for grade distribution
- Top performers list with ranking
- Performance indicators

### QR Codes
- Auto-generated QR codes for each student
- Scan to access student profile instantly
- Download QR codes as PNG images

## 🎨 Design System

- **Primary Color**: Indigo (indigo-600)
- **Background**: Slate gray (slate-50)
- **Text**: Slate (slate-900, slate-600, slate-500)
- **Success**: Emerald
- **Warning**: Amber
- **Error**: Red

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Other Platforms
```bash
npm run build
npm start
```

## 📝 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Alvin**
- GitHub: [@Alvin-progg](https://github.com/Alvin-progg)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for authentication services
- Recharts for beautiful charts
- Lucide for the icon set

---

**EduCore** - Modern Academic Management System for Teachers
