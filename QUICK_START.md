# Quick Start Guide - Attendance App

## 🚀 Running the App

```bash
# Start the development server
npm start

# Or run directly on a platform
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

## 📱 App Flow

### First Time Use

1. **Welcome Screen** - Choose your role:
   - 👨‍🏫 Teacher
   - 👨‍🎓 Student

2. Enter your name and tap "Continue"

---

## 👨‍🏫 Teacher Workflow

### Tab Navigation

- **My Classes** - View all your created classes
- **Add Class** - Create a new class
- **Reports** - View attendance analytics
- **Profile** - Your account info

### Creating and Managing a Class

1. **Create a Class**
   - Go to "Add Class" tab
   - Fill in: Name, Description, Date (YYYY-MM-DD), Time
   - Tap "Create Class"

2. **Start a Class Session**
   - Tap on a class from "My Classes"
   - Tap "▶️ Start Class" button
   - Class becomes active (students can now mark attendance)

3. **View Enrollments**
   - In class details, tap "Enrollments" tab
   - See all enrolled students

4. **Mark Attendance**
   - In class details, tap "Attendance" tab
   - Mark each student as Present or Absent
   - Attendance is recorded for today's date

5. **End Class**
   - Tap "⏹️ End Class" when done
   - Students can no longer mark attendance

### Viewing Reports

1. Go to "Reports" tab
2. Select a class
3. View:
   - Total students, present, absent counts
   - Student-wise attendance percentages
   - Color-coded performance indicators
   - Date-wise attendance history

---

## 👨‍🎓 Student Workflow

### Tab Navigation

- **Classes** - Browse all available classes
- **My Classes** - View your enrolled classes
- **Profile** - Your account info

### Enrolling in a Class

1. Go to "Classes" tab
2. Browse available classes
3. Tap "Enroll" on any class
4. Confirmation message appears

### Attending a Class

1. Go to "My Classes" tab
2. Tap on an enrolled class
3. When class is active, tap "✓ Mark Attendance"
4. Your attendance is recorded

### Tracking Your Attendance

- In "My Classes", see your stats for each class:
  - **Green (75%+)** - Good attendance
  - **Orange (50-74%)** - Average attendance
  - **Red (<50%)** - Poor attendance

---

## 🎨 Features Implemented

### ✅ Teacher Features

- [x] Add Class
- [x] Start Class
- [x] Confirm Student Enrollment
- [x] Confirm Attendance
- [x] View Attendance Report

### ✅ Student Features

- [x] View Classes
- [x] Enroll in Class (once per class)
- [x] Attend Class

---

## 📊 App Architecture

```
app/
├── index.tsx                    # Role selection screen
├── _layout.tsx                  # Root layout with AppProvider
├── class-details.tsx            # Class management & attendance
└── (tabs)/
    ├── _layout.tsx              # Tab navigation (role-based)
    ├── index.tsx                # Classes list (Teacher/Student)
    ├── add-class.tsx            # Create class (Teacher only)
    ├── reports.tsx              # Attendance reports (Teacher only)
    ├── my-classes.tsx           # Enrolled classes (Student only)
    └── profile.tsx              # User profile

context/
└── AppContext.tsx               # Global state management

types/
└── index.ts                     # TypeScript interfaces
```

---

## 🎯 Key Concepts

### Class States

- **Inactive** (default) - Class created but not started
- **Active** - Class in session, students can mark attendance

### Enrollment Rules

- Students can only enroll once per class
- Enrollment is permanent (no unenroll feature)

### Attendance Rules

- Only enrolled students can mark attendance
- Can only mark attendance when class is active
- One attendance record per student per day
- Teachers can mark/update attendance anytime

### Data Persistence

- All data is stored in memory (React Context)
- Data resets when app is closed
- For production, implement AsyncStorage or database

---

## 🎨 UI/UX Features

- **Role-based Navigation** - Different tabs for teachers and students
- **Color-coded Indicators** - Visual feedback for attendance percentages
- **Active Class Badges** - Green badges show active classes
- **Real-time Updates** - Instant feedback on all actions
- **Responsive Cards** - Clean, modern card-based UI
- **Progress Bars** - Visual attendance tracking
- **Empty States** - Helpful messages when no data

---

## 🔍 Testing the App

### Test as Teacher

1. Select Teacher role
2. Create 2-3 classes
3. Start one class
4. Check Reports tab (will be empty until students enroll)

### Test as Student

1. Logout and select Student role
2. Enroll in the active class
3. Mark attendance
4. Check "My Classes" to see your stats

### Test Both Roles

1. Use multiple devices/simulators
2. Or logout and switch roles
3. See how teacher and student views interact

---

## 🐛 Troubleshooting

**Issue**: Can't mark attendance

- **Solution**: Ensure class is active and student is enrolled

**Issue**: Don't see any classes

- **Solution**: Teacher needs to create classes first

**Issue**: Enrollment button disabled

- **Solution**: You're already enrolled in that class

**Issue**: Reports show no data

- **Solution**: Students need to enroll and mark attendance first

---

## 📝 Notes

- This is a demo app with in-memory storage
- Data will be lost when app is closed
- Perfect for testing and demonstration
- For production use, add persistent storage
- All features from the assignment are implemented

---

## ✨ Enjoy using the Attendance App
