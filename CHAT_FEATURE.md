# Chat Feature Documentation

## Overview
A real-time chat feature has been added to the attendance app. The chat becomes available **only when a class is active** (started by the teacher), allowing real-time communication between teachers and enrolled students.

## Features

### 🎯 Key Capabilities
- **Real-time messaging**: Messages appear instantly for all participants
- **Active class only**: Chat is only available when a class is started
- **Role-based UI**: Different views for teachers and students
- **Visual indicators**: Teacher messages are highlighted with a green border
- **Auto-scroll**: Messages automatically scroll to the latest message
- **Message metadata**: Shows sender name, role icon, and timestamp

### 👥 User Roles

#### Teacher View
- Access chat through a dedicated "💬 Chat" tab (appears only when class is active)
- Can see all messages from students and themselves
- Teacher messages are sent with a 👨‍🏫 icon

#### Student View
- Chat appears automatically below attendance button when class is active
- Can see all messages from teacher and other students
- Student messages are sent with a 👨‍🎓 icon
- Teacher messages are highlighted with green border for easy identification

## Technical Implementation

### Type Definitions
Added `ChatMessage` interface in `types/index.ts`:
```typescript
export interface ChatMessage {
  id: string;
  classId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  message: string;
  createdAt: string;
}
```

### Context Methods
Added to `AppContext.tsx`:
- `chatMessages`: Array of all chat messages
- `sendChatMessage(classId, message)`: Send a new message
- `getClassChatMessages(classId)`: Get messages for a specific class

### Firebase Collection
- Collection name: `chatMessages`
- Real-time listener with ordering by `createdAt`
- Messages are stored permanently for class history

### Security Rules
Updated Firebase security rules to:
- Allow read access to all authenticated users
- Allow message creation only when:
  - User is authenticated
  - Class is active (`isActive: true`)
  - User is either the teacher of the class OR an enrolled student
  - Message userId matches the authenticated user
- Prevent message updates and deletions (immutable)

## How to Test

### Prerequisites
1. Have at least one teacher account and one student account
2. Create a class as a teacher
3. Enroll the student in the class

### Testing Steps

#### 1. Start the Class (Teacher)
1. Login as a teacher
2. Navigate to "My Classes" tab
3. Select a class you created
4. Click "▶️ Start Class" button
5. Verify the "Active" badge appears
6. Notice the "💬 Chat" tab appears in the navigation

#### 2. Access Chat (Teacher)
1. Click on the "💬 Chat" tab
2. You should see an empty chat with message: "💬 No messages yet. Start the conversation!"
3. Type a message in the input field at the bottom
4. Click "Send"
5. Your message appears on the right side in blue

#### 3. Access Chat (Student)
1. Login as a student (in a different browser/device or incognito mode)
2. Navigate to "My Classes" tab
3. Select the enrolled class
4. Verify the "Active" badge is showing
5. Scroll down to see the "💬 Class Chat" section with "Live" badge
6. You should see the teacher's message

#### 4. Real-time Communication
1. As student, send a message
2. As teacher, verify the message appears instantly in the chat tab
3. Notice the student message has a 👨‍🎓 icon and appears on the left
4. Send multiple messages from both accounts
5. Verify all messages appear in chronological order
6. Check that teacher messages have a green left border for students

#### 5. End Class (Teacher)
1. As teacher, click "⏹️ End Class"
2. Verify the "💬 Chat" tab disappears
3. As student, verify the chat section is no longer visible
4. Messages are preserved in Firebase for future reference

## UI/UX Details

### Message Styling
- **Own messages**: Blue background, right-aligned
- **Other messages**: White background, left-aligned
- **Teacher messages** (for students): Light green background with green left border
- **Timestamps**: Small text showing time in HH:MM format
- **Sender name**: Shown for other users' messages with role icon

### Input Field
- Multi-line support for longer messages
- 500 character limit
- "Send" button disabled when input is empty
- Placeholder: "Type a message..."

### Layout
- **Teachers**: Tab-based navigation (Details, Enrollments, Attendance, Chat)
- **Students**: Chat appears as a dedicated section below attendance controls
- Keyboard-aware: Input moves up when keyboard appears (iOS)
- Scrollable message list with auto-scroll to latest message

## Firebase Rules to Apply

Copy the updated rules from `FIREBASE_RULES.txt` to your Firebase Console:
1. Go to Firebase Console → Firestore Database → Rules
2. Replace with the content from `FIREBASE_RULES.txt`
3. Click "Publish"

The rules ensure:
- Only authenticated users can access chat
- Messages can only be sent when class is active
- Users can only send messages as themselves
- Only enrolled students and class teachers can participate

## Future Enhancements
Potential improvements for the chat feature:
- [ ] Message reactions (👍, ❤️, etc.)
- [ ] File/image sharing
- [ ] Message editing (within time limit)
- [ ] Read receipts
- [ ] Typing indicators
- [ ] Message search
- [ ] Chat history export
- [ ] Notifications for new messages
- [ ] @mentions for specific users
- [ ] Private messaging between teacher and student

## Troubleshooting

### Chat tab not appearing
- Verify the class `isActive` field is `true` in Firestore
- Check that you're logged in as the teacher who owns the class

### Messages not sending
- Check Firebase security rules are properly configured
- Verify user is enrolled in the class (for students)
- Ensure class is active
- Check browser console for errors

### Messages not appearing in real-time
- Verify Firebase listeners are working (check network tab)
- Ensure multiple devices/browsers are properly authenticated
- Check Firestore collection `chatMessages` is being populated

## Support
For issues or questions about the chat feature, check:
1. Firebase Console → Firestore Database → Data (verify messages are being created)
2. Browser Console (check for JavaScript errors)
3. Firebase Console → Firestore Database → Rules (verify rules are published)

