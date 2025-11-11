# Attendance App

A comprehensive mobile attendance application built with React Native and Expo that serves both teachers and students.

## Features

### Teacher Features

1. **Add Class** - Teachers can create new classes with:
   - Class name
   - Description
   - Schedule (date and time)

2. **Start/End Class** - Teachers can:
   - Start a class session to make it active
   - End a class session when finished
   - Only active classes allow student attendance

3. **Confirm Student Enrollment** - Teachers can:
   - View all students enrolled in their classes
   - See enrollment dates
   - Track total enrollment numbers

4. **Confirm Attendance** - Teachers can:
   - Mark students as present or absent
   - View today's attendance for each class
   - Update attendance records in real-time

5. **View Attendance Reports** - Teachers can:
   - Select any of their classes to view reports
   - See student-wise attendance statistics
   - View attendance percentages with color-coded indicators
   - Track date-wise attendance records
   - View summary statistics (total students, present, absent)

### Student Features

1. **View Classes** - Students can:
   - Browse all available classes
   - See class details (name, description, teacher, schedule)
   - View which classes are currently active

2. **Enroll in Class** - Students can:
   - Enroll in any available class
   - Can only enroll once per class
   - See enrollment confirmation

3. **Attend Class** - Students can:
   - Mark their attendance when class is active
   - Only able to attend if enrolled
   - View their attendance statistics for each class
   - Track their attendance percentage with visual indicators

4. **My Classes** - Students can:
   - View all their enrolled classes
   - See their attendance statistics for each class
   - Track present/absent records
   - View attendance percentages with color-coded progress bars

## App Structure

### Screens

#### Common Screens

- **Role Selection** (`app/index.tsx`) - Initial screen where users select their role (Teacher/Student) and enter their name
- **Profile** (`app/(tabs)/profile.tsx`) - User profile with stats and logout functionality

#### Teacher Screens

- **My Classes** (`app/(tabs)/index.tsx`) - List of classes created by the teacher
- **Add Class** (`app/(tabs)/add-class.tsx`) - Form to create a new class
- **Reports** (`app/(tabs)/reports.tsx`) - Detailed attendance reports and analytics
- **Class Details** (`app/class-details.tsx`) - Manage class, view enrollments, and mark attendance

#### Student Screens

- **Classes** (`app/(tabs)/index.tsx`) - Browse and enroll in available classes
- **My Classes** (`app/(tabs)/my-classes.tsx`) - View enrolled classes with attendance stats
- **Class Details** (`app/class-details.tsx`) - View class info and mark attendance

### Data Models

#### User

- `id`: Unique identifier
- `name`: User's name
- `role`: 'teacher' or 'student'

#### Class

- `id`: Unique identifier
- `name`: Class name
- `description`: Class description
- `teacherId`: ID of the teacher who created the class
- `teacherName`: Name of the teacher
- `schedule`: Object containing date and time
- `isActive`: Boolean indicating if class is currently in session
- `createdAt`: Creation timestamp

#### Enrollment

- `id`: Unique identifier
- `classId`: ID of the class
- `studentId`: ID of the student
- `studentName`: Name of the student
- `enrolledAt`: Enrollment timestamp

#### AttendanceRecord

- `id`: Unique identifier
- `classId`: ID of the class
- `studentId`: ID of the student
- `studentName`: Name of the student
- `date`: Date of attendance (YYYY-MM-DD)
- `status`: 'present' or 'absent'
- `markedAt`: Timestamp when attendance was marked

### State Management

The app uses React Context API (`context/AppContext.tsx`) to manage global state including:

- Current user information
- Classes list
- Enrollments
- Attendance records

All data is stored in memory and will reset when the app is closed.

## Getting Started

### Prerequisites

- Node.js installed
- Expo CLI installed (`npm install -g expo-cli`)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## Usage Guide

### For Teachers

1. **Getting Started**
   - Select "Teacher" role on the welcome screen
   - Enter your name and continue

2. **Creating a Class**
   - Navigate to "Add Class" tab
   - Fill in class details (name, description, date, time)
   - Tap "Create Class"

3. **Managing a Class**
   - Tap on any class from "My Classes"
   - Use "Start Class" button to make it active
   - Switch to "Enrollments" tab to see enrolled students
   - Switch to "Attendance" tab to mark attendance
   - Use "End Class" when session is complete

4. **Viewing Reports**
   - Navigate to "Reports" tab
   - Select a class to view detailed statistics
   - See student-wise attendance percentages
   - Track date-wise attendance records

### For Students

1. **Getting Started**
   - Select "Student" role on the welcome screen
   - Enter your name and continue

2. **Enrolling in Classes**
   - Browse classes in "Classes" tab
   - Tap "Enroll" on any class you want to join
   - You can only enroll once per class

3. **Attending Classes**
   - Go to "My Classes" to see your enrolled classes
   - Tap on a class to view details
   - When the class is active, tap "Mark Attendance"
   - Your attendance will be recorded

4. **Tracking Your Attendance**
   - View your attendance statistics in "My Classes"
   - See percentage with color indicators:
     - Green: 75% or higher (Good)
     - Orange: 50-74% (Average)
     - Red: Below 50% (Poor)

## Technical Details

### Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type-safe JavaScript
- **React Context API** - State management
- **Expo Router** - File-based routing

### Key Features

- Role-based navigation (different tabs for teachers and students)
- Real-time attendance tracking
- Color-coded attendance indicators
- Comprehensive reporting system
- Clean and modern UI design
- Type-safe codebase with TypeScript

## Future Enhancements

Potential improvements for future versions:

- Persistent storage (AsyncStorage or database)
- Push notifications for class reminders
- QR code-based attendance
- Export reports as PDF
- Class schedule calendar view
- Student profile pictures
- Class capacity limits
- Attendance history graphs
- Multi-language support

## License

This project is created for educational purposes.
