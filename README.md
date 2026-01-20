# Attendance App

A comprehensive mobile attendance application built with React Native and Expo, featuring real-time communication, attendance tracking, and comprehensive reporting capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Setup Instructions](#setup-instructions)
- [User Guide](#user-guide)
- [Technical Documentation](#technical-documentation)

---

## Overview

The Attendance App is a full-featured mobile application that serves both teachers and students, providing a complete solution for class management, attendance tracking, real-time communication, and comprehensive reporting. Built with React Native and Expo, it leverages Firebase for authentication, real-time database, and secure data storage.

### Key Capabilities

- 🔐 **Secure Authentication** - Email/password authentication with role-based access
- 📚 **Class Management** - Create, manage, and track classes
- ✅ **Attendance Tracking** - Real-time attendance marking and tracking
- 💬 **Live Chat** - Real-time messaging during active classes
- 📊 **Comprehensive Reports** - Detailed analytics and statistics
- 📥 **CSV Export** - Download attendance reports for external use
- 🔄 **Real-time Sync** - Multi-device synchronization
- 📱 **Cross-platform** - Works on iOS, Android, and Web

---

## Features

### 👨‍🏫 Teacher Features

#### 1. Class Management

- **Create Classes** with:
  - Class name and description
  - Schedule (date and time)
  - Teacher assignment
- **Start/End Class Sessions**
  - Activate classes for student attendance
  - Control when students can mark attendance
  - Monitor active class status

#### 2. Student Enrollment

- View all enrolled students
- Track enrollment dates
- Monitor total enrollment numbers
- See student details and history

#### 3. Attendance Management

- Mark students as present or absent
- View today's attendance for each class
- Update attendance records in real-time
- Bulk attendance operations

#### 4. Attendance Reports

- Select classes to view detailed reports
- Student-wise attendance statistics
- Attendance percentages with color-coded indicators:
  - 🟢 Green: 75% or higher (Good)
  - 🟠 Orange: 50-74% (Average)
  - 🔴 Red: Below 50% (Poor)
- Date-wise attendance records
- Summary statistics (total students, present, absent)

#### 5. CSV Export

- Download comprehensive attendance reports
- Available in Reports and Class Details screens
- Includes:
  - Class information header
  - Detailed attendance records (sorted by date)
  - Summary statistics
  - Student-wise attendance summary with percentages
- Web-only feature (mobile support coming soon)
- File format: `attendance_[class_name]_[date].csv`

#### 6. Real-time Chat

- Access via "💬 Chat" tab when class is active
- Send messages to all enrolled students
- View messages in real-time
- Messages highlighted with teacher indicator
- Message timestamps and sender information

### 👨‍🎓 Student Features

#### 1. Browse Classes

- View all available classes
- See class details (name, description, teacher, schedule)
- Identify currently active classes
- Filter and search classes

#### 2. Enroll in Classes

- One-click enrollment in any available class
- Can only enroll once per class
- Instant enrollment confirmation
- View enrollment date

#### 3. Mark Attendance

- Mark attendance when class is active
- Only available for enrolled classes
- View attendance confirmation
- One attendance record per day per class

#### 4. My Classes Dashboard

- View all enrolled classes
- See attendance statistics for each class
- Track present/absent records
- Visual attendance percentages with progress bars
- Monitor overall attendance performance

#### 5. Real-time Chat

- Participate in class chat when active
- Chat section appears below attendance button
- Teacher messages highlighted in green
- Send messages to teacher and classmates
- Real-time message delivery

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (automatically installed with project)
- iOS Simulator (Mac only) or Android Emulator
- Firebase account (free tier works)

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Firebase
npm install firebase

# 3. Start the development server
npm start

# Then choose your platform:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Press 'w' for web browser
```

---

## Setup Instructions

### 1. Clone and Install

```bash
# Navigate to project directory
cd my-app

# Install dependencies
npm install
```

### 2. Firebase Configuration

Your Firebase configuration is already set up in `config/firebase.ts`. Follow these steps to enable Firebase services:

#### A. Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **test-native-fac**
3. Navigate to **Build** → **Authentication** → **Get started**
4. Go to **Sign-in method** tab
5. Click on **Email/Password**
6. Enable the first option (Email/Password)
7. Click **Save**

#### B. Create Firestore Database

1. In Firebase Console, click **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **"Start in test mode"** (we'll add security rules next)
4. Select a location closest to you
5. Click **Enable**

#### C. Set Up Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Open the `FIREBASE_RULES.txt` file in your project directory
3. Copy all the security rules from `FIREBASE_RULES.txt`
4. Paste them into the Firebase Console rules editor
5. Click **Publish**

> 📄 **Note**: The complete security rules are available in the [`FIREBASE_RULES.txt`](./FIREBASE_RULES.txt) file in the project root. These rules implement:
>
> - Role-based access control (teacher/student permissions)
> - Authentication requirements for all operations
> - Class-specific permissions (teachers control their classes)
> - Chat security (only active classes, enrolled students)
> - Data validation and protection

### 3. Run the Application

```bash
# Start development server
npm start

# Or run on specific platform
npm run web      # Web browser
npm run ios      # iOS simulator (Mac only)
npm run android  # Android emulator
```

---

## User Guide

### For Teachers

#### Getting Started

1. Open the app
2. Tap "Sign Up"
3. Enter your email, password, and name
4. Select "Teacher" role
5. Tap "Register"

#### Creating a Class

1. Navigate to "Add Class" tab
2. Fill in class details:
   - Class name
   - Description
   - Schedule date (YYYY-MM-DD)
   - Schedule time
3. Tap "Create Class"
4. Class appears in "My Classes"

#### Managing a Class Session

1. **Start Class**:
   - Open class from "My Classes"
   - Tap "▶️ Start Class" button
   - Class becomes active (green "Active" badge appears)
   - Chat tab becomes available

2. **View Enrollments**:
   - Tap "Enrollments" tab
   - See all enrolled students
   - View enrollment dates

3. **Mark Attendance**:
   - Tap "Attendance" tab
   - See list of enrolled students
   - Mark each student as Present/Absent
   - Attendance is recorded for today's date

4. **Use Chat**:
   - Tap "💬 Chat" tab
   - Type message in input field
   - Tap "Send"
   - Messages appear instantly for all participants

5. **End Class**:
   - Tap "⏹️ End Class"
   - Class becomes inactive
   - Chat becomes unavailable
   - Attendance records are preserved

#### Viewing Reports

1. Navigate to "Reports" tab
2. Select a class from dropdown
3. View comprehensive statistics:
   - Total students enrolled
   - Total present and absent counts
   - Student-wise attendance percentages
   - Date-wise attendance records
4. Export data:
   - Click "📥 Export CSV" button
   - File downloads automatically (web only)
   - Open in Excel, Google Sheets, or Numbers

### For Students

#### Getting Started

1. Open the app
2. Tap "Sign Up"
3. Enter your email, password, and name
4. Select "Student" role
5. Tap "Register"

#### Enrolling in Classes

1. Navigate to "Classes" tab
2. Browse available classes
3. View class details (name, description, teacher, schedule)
4. Tap "Enroll" on desired class
5. See confirmation message
6. Class appears in "My Classes"

#### Attending Classes

1. Go to "My Classes" tab
2. Tap on an enrolled class
3. When class is active (green "Active" badge):
   - Tap "✓ Mark Attendance" button
   - See confirmation message
   - Attendance is recorded

#### Using Chat

1. Open an active class from "My Classes"
2. Scroll down to "💬 Class Chat" section
3. View messages from teacher and classmates
4. Teacher messages are highlighted with green border
5. Type message and tap "Send"
6. Messages appear in real-time

#### Tracking Your Attendance

- In "My Classes", view your stats for each class:
  - Present/absent counts
  - Attendance percentage
  - Visual progress bar with color coding:
    - 🟢 Green (75%+): Good attendance
    - 🟠 Orange (50-74%): Average attendance
    - 🔴 Red (<50%): Poor attendance

---

## Technical Documentation

### Tech Stack

#### Frontend

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **UI**: Custom themed components
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API

#### Backend

- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Real-time**: Firestore onSnapshot listeners

#### Key Libraries

- `firebase`: Backend services
- `expo-router`: Navigation
- `react-native`: Cross-platform UI

### Project Structure

```
my-app/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab navigation (role-based)
│   │   ├── add-class.tsx         # Create class (Teacher)
│   │   ├── explore.tsx           # Explore screen
│   │   ├── index.tsx             # Classes list (Teacher/Student)
│   │   ├── my-classes.tsx        # Enrolled classes (Student)
│   │   ├── profile.tsx           # User profile
│   │   └── reports.tsx           # Attendance reports (Teacher)
│   ├── auth/
│   │   ├── login.tsx             # Login screen
│   │   ├── register.tsx          # Registration screen
│   │   └── reset-password.tsx   # Password reset
│   ├── _layout.tsx               # Root layout with AppProvider
│   ├── class-details.tsx         # Class management & chat
│   ├── index.tsx                 # Auth state handler
│   └── modal.tsx                 # Modal screen
├── components/
│   └── ui/                       # Reusable UI components
├── config/
│   └── firebase.ts               # Firebase configuration
├── context/
│   └── AppContext.tsx            # Global state management
├── constants/
│   └── theme.ts                  # App theme configuration
├── types/
│   └── index.ts                  # TypeScript interfaces
├── utils/
│   └── csvExport.ts              # CSV export utilities
├── package.json                  # Dependencies
└── README.md                     # This file
```

### Data Models

#### User

```typescript
{
  id: string;              // Firebase Auth UID
  name: string;            // User's full name
  email: string;           // Email address
  role: 'teacher' | 'student';
  createdAt: string;       // ISO timestamp
}
```

#### Class

```typescript
{
  id: string;              // Auto-generated ID
  name: string;            // Class name
  description: string;     // Class description
  teacherId: string;       // Teacher's user ID
  teacherName: string;     // Teacher's name
  schedule: {
    date: string;          // YYYY-MM-DD format
    time: string;          // Time string
  };
  isActive: boolean;       // Class session status
  createdAt: string;       // ISO timestamp
}
```

#### Enrollment

```typescript
{
  id: string;              // Auto-generated ID
  classId: string;         // Class ID
  studentId: string;       // Student's user ID
  studentName: string;     // Student's name
  enrolledAt: string;      // ISO timestamp
}
```

#### AttendanceRecord

```typescript
{
  id: string;              // Auto-generated ID
  classId: string;         // Class ID
  studentId: string;       // Student's user ID
  studentName: string;     // Student's name
  date: string;            // YYYY-MM-DD format
  status: 'present' | 'absent';
  markedAt: string;        // ISO timestamp
}
```

#### ChatMessage

```typescript
{
  id: string;              // Auto-generated ID
  classId: string;         // Class ID
  userId: string;          // Sender's user ID
  userName: string;        // Sender's name
  userRole: 'teacher' | 'student';
  message: string;         // Message content
  createdAt: string;       // ISO timestamp
}
```

### Firestore Collections

- **users/**: User profiles and authentication data
- **classes/**: All class information
- **enrollments/**: Student-class enrollment records
- **attendance/**: Attendance records
- **chatMessages/**: Real-time chat messages

### Key Features Implementation

#### Real-time Chat

- WebSocket-based communication via Firestore listeners
- Only available when class is active
- Role-based UI (different views for teachers/students)
- Teacher messages highlighted for students
- Auto-scroll to latest messages
- Message validation and security rules

#### CSV Export

- Comprehensive attendance data export
- Proper CSV formatting with special character handling
- Summary statistics and student-wise analysis
- Web platform only (mobile support planned)
- Standardized filename generation

#### Security

- Role-based access control via Firestore rules
- Authentication required for all operations
- Users can only access authorized data
- Teachers control their own classes
- Students can only mark their own attendance

---

## CSV Export Details

### File Format

CSV files are named using the format: `attendance_[class_name]_[date].csv`

Example: `attendance_mathematics_101_2026-01-20.csv`

### CSV Contents

1. **Header Section**:
   - Class name
   - Teacher name
   - Report generation timestamp

2. **Attendance Records**:
   - Student name
   - Student ID
   - Date
   - Status (PRESENT/ABSENT)
   - Timestamp when marked

3. **Summary Statistics**:
   - Total students enrolled
   - Total attendance records
   - Total present count
   - Total absent count

4. **Student-wise Summary**:
   - Individual student statistics
   - Total classes attended
   - Present/absent counts
   - Attendance percentage

### Platform Support

- ✅ **Web**: Full support with browser download
- ⚠️ **Mobile**: Coming soon (will use native share functionality)

### Opening CSV Files

- **Microsoft Excel**: File → Open → Select CSV
- **Google Sheets**: File → Import → Upload CSV
- **Apple Numbers**: File → Open → Select CSV

---

---

## License

This project is created for educational purposes.

---

**Congratulations! You're ready to use the Attendance App!** 🎉

For setup assistance, refer to the [Setup Instructions](#setup-instructions) section above.
