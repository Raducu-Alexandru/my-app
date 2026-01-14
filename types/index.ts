export type UserRole = 'teacher' | 'student';

export interface User {
	id: string;
	name: string;
	role: UserRole;
}

export interface Class {
	id: string;
	name: string;
	description: string;
	teacherId: string;
	teacherName: string;
	schedule: {
		date: string;
		time: string;
	};
	isActive: boolean;
	createdAt: string;
}

export interface Enrollment {
	id: string;
	classId: string;
	studentId: string;
	studentName: string;
	enrolledAt: string;
}

export interface AttendanceRecord {
	id: string;
	classId: string;
	studentId: string;
	studentName: string;
	date: string;
	status: 'present' | 'absent';
	markedAt: string;
}

export interface ChatMessage {
	id: string;
	classId: string;
	userId: string;
	userName: string;
	userRole: UserRole;
	message: string;
	createdAt: string;
}
