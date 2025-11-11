# Firebase Integration Setup Guide

## 🔥 Firebase Setup Complete

Your Attendance App now uses Firebase for:

- ✅ **Authentication** (Email/Password)
- ✅ **Database** (Firestore)
- ✅ **Real-time Updates**

---

## 📦 Step 1: Install Dependencies

Run this command in your project directory:

```bash
npm install firebase
```

---

## 🔐 Step 2: Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **test-native-fac**
3. In the left sidebar, click **"Build"** → **"Authentication"**
4. Click **"Get started"**
5. Go to **"Sign-in method"** tab
6. Click on **"Email/Password"**
7. **Enable** the first option (Email/Password)
8. Click **"Save"**

---

## 🗄️ Step 3: Create Firestore Database

1. In Firebase Console, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll add security rules next)
4. Select a location (choose closest to you)
5. Click **"Enable"**

---

## 🔒 Step 4: Set Up Firestore Security Rules

1. In Firestore Database, go to the **"Rules"** tab
2. Replace the default rules with these:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Helper function to get user role from users collection
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles
      allow read: if isSignedIn();
      
      // Users can only create their own profile during registration
      allow create: if isSignedIn() && request.auth.uid == userId;
      
      // Users can only update their own profile
      allow update: if isSignedIn() && request.auth.uid == userId;
      
      // No one can delete user profiles
      allow delete: if false;
    }
    
    // Classes collection
    match /classes/{classId} {
      // Anyone authenticated can read classes
      allow read: if isSignedIn();
      
      // Only teachers can create classes
      allow create: if isSignedIn() && 
                      getUserRole() == 'teacher' &&
                      request.resource.data.teacherId == request.auth.uid;
      
      // Only the class teacher can update their classes
      allow update: if isSignedIn() && 
                      resource.data.teacherId == request.auth.uid;
      
      // Only the class teacher can delete their classes
      allow delete: if isSignedIn() && 
                      resource.data.teacherId == request.auth.uid;
    }
    
    // Enrollments collection
    match /enrollments/{enrollmentId} {
      // Anyone authenticated can read enrollments
      allow read: if isSignedIn();
      
      // Only students can enroll themselves
      allow create: if isSignedIn() && 
                      getUserRole() == 'student' &&
                      request.resource.data.studentId == request.auth.uid;
      
      // No one can update enrollments
      allow update: if false;
      
      // Students can unenroll themselves (for future feature)
      allow delete: if isSignedIn() && 
                      resource.data.studentId == request.auth.uid;
    }
    
    // Attendance collection
    match /attendance/{attendanceId} {
      // Anyone authenticated can read attendance
      allow read: if isSignedIn();
      
      // Teachers can mark attendance for their classes
      // Students can mark their own attendance
      allow create: if isSignedIn() && (
        (getUserRole() == 'teacher' && 
         get(/databases/$(database)/documents/classes/$(request.resource.data.classId)).data.teacherId == request.auth.uid) ||
        (getUserRole() == 'student' && 
         request.resource.data.studentId == request.auth.uid)
      );
      
      // Only teachers can update attendance for their classes
      allow update: if isSignedIn() && 
                      getUserRole() == 'teacher' &&
                      get(/databases/$(database)/documents/classes/$(resource.data.classId)).data.teacherId == request.auth.uid;
      
      // No one can delete attendance records
      allow delete: if false;
    }
  }
}
```

3. Click **"Publish"**

---

## 🎯 Step 5: Firestore Database Structure

Your app will automatically create these collections:

### **users** collection

```javascript
{
  id: "user_uid",
  name: "John Doe",
  email: "john@example.com",
  role: "teacher" | "student",
  createdAt: "2024-01-15T10:00:00.000Z"
}
```

### **classes** collection

```javascript
{
  id: "auto_generated_id",
  name: "Introduction to React Native",
  description: "Learn mobile app development",
  teacherId: "teacher_uid",
  teacherName: "Teacher Name",
  schedule: {
    date: "2024-01-20",
    time: "10:00 AM"
  },
  isActive: false,
  createdAt: "2024-01-15T10:00:00.000Z"
}
```

### **enrollments** collection

```javascript
{
  id: "auto_generated_id",
  classId: "class_id",
  studentId: "student_uid",
  studentName: "Student Name",
  enrolledAt: "2024-01-15T10:00:00.000Z"
}
```

### **attendance** collection

```javascript
{
  id: "auto_generated_id",
  classId: "class_id",
  studentId: "student_uid",
  studentName: "Student Name",
  date: "2024-01-15",
  status: "present" | "absent",
  markedAt: "2024-01-15T10:00:00.000Z"
}
```

---

## 🚀 Step 6: Run Your App

```bash
npm start
```

Then:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Or scan QR code with Expo Go app

---

## 🎮 Testing the App

### 1. **Create a Teacher Account**

- Open the app
- Tap "Sign Up"
- Fill in details and select "Teacher"
- Register

### 2. **Create a Student Account**

- Logout (from Profile tab)
- Tap "Sign Up"
- Fill in details and select "Student"
- Register

### 3. **As Teacher:**

- Create a class in "Add Class" tab
- Start the class
- View enrollments and mark attendance

### 4. **As Student:**

- Browse classes in "Classes" tab
- Enroll in a class
- Mark attendance when class is active
- Check your stats in "My Classes"

---

## 🔍 Verify Firebase Integration

1. **Authentication:**
   - Go to Firebase Console → Authentication → Users
   - You should see registered users

2. **Firestore:**
   - Go to Firebase Console → Firestore Database → Data
   - You should see collections being created as you use the app

3. **Real-time Updates:**
   - Open app on two devices/simulators
   - Make changes on one device
   - See updates appear instantly on the other device

---

## 🛡️ Security Features

✅ **User Authentication** - Only authenticated users can access the app
✅ **Role-Based Access** - Teachers and students have different permissions
✅ **Data Validation** - Firestore rules prevent unauthorized access
✅ **Real-time Sync** - All data syncs across devices instantly

---

## 📝 What Changed From Original App?

### **Before (In-Memory):**

- ❌ Data lost on app restart
- ❌ No authentication
- ❌ Single device only
- ❌ No data persistence

### **After (Firebase):**

- ✅ Data persists forever
- ✅ Email/Password authentication
- ✅ Multi-device sync
- ✅ Real-time updates
- ✅ Secure access control

---

## 🔧 Troubleshooting

### **Issue: "Firebase App named '[DEFAULT]' already exists"**

**Solution:** The app is already initialized. This is not an error.

### **Issue: "Permission denied" in Firestore**

**Solution:** Make sure you've published the security rules in Step 4.

### **Issue: Can't login/register**

**Solution:**

1. Check Firebase Console → Authentication
2. Make sure Email/Password is enabled
3. Check browser console for errors

### **Issue: Data not syncing**

**Solution:**

1. Check internet connection
2. Verify Firestore is created and enabled
3. Check security rules are published

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

## ✨ Features Enabled

- 🔐 Email/Password Authentication
- 📱 Real-time Data Synchronization
- 🔒 Secure Access Control
- 💾 Persistent Data Storage
- 🌐 Multi-device Support
- 👥 Role-based Permissions

---

**Your app is now powered by Firebase!** 🎉
