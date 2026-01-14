import { auth, db } from '@/config/firebase';
import { AttendanceRecord, ChatMessage, Class, Enrollment, User } from '@/types';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AppContextType {
	// User state
	currentUser: User | null;
	setCurrentUser: (user: User | null) => void;
	loading: boolean;

	// Classes state
	classes: Class[];
	addClass: (classData: Omit<Class, 'id' | 'createdAt'>) => Promise<void>;
	updateClass: (id: string, updates: Partial<Class>) => Promise<void>;
	getClassById: (id: string) => Class | undefined;
	getTeacherClasses: (teacherId: string) => Class[];

	// Enrollments state
	enrollments: Enrollment[];
	enrollInClass: (classId: string, studentId: string, studentName: string) => Promise<boolean>;
	getClassEnrollments: (classId: string) => Enrollment[];
	getStudentEnrollments: (studentId: string) => Enrollment[];
	isStudentEnrolled: (classId: string, studentId: string) => boolean;

	// Attendance state
	attendanceRecords: AttendanceRecord[];
	markAttendance: (classId: string, studentId: string, studentName: string, status: 'present' | 'absent') => Promise<void>;
	getClassAttendance: (classId: string) => AttendanceRecord[];
	getStudentAttendance: (studentId: string) => AttendanceRecord[];

	// Chat state
	chatMessages: ChatMessage[];
	sendChatMessage: (classId: string, message: string) => Promise<void>;
	getClassChatMessages: (classId: string) => ChatMessage[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [classes, setClasses] = useState<Class[]>([]);
	const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
	const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
	const [loading, setLoading] = useState(true);

	// Listen to auth state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				// User is signed in, get user profile from Firestore
				try {
					const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
					if (userDoc.exists()) {
						const userData = userDoc.data();
						setCurrentUser({
							id: firebaseUser.uid,
							name: userData.name,
							role: userData.role,
						});
					}
				} catch (error) {
					console.error('Error fetching user profile:', error);
				}
			} else {
				// User is signed out
				setCurrentUser(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	// Listen to classes collection
	useEffect(() => {
		if (!currentUser) {
			setClasses([]);
			return;
		}

		const classesQuery = query(collection(db, 'classes'));
		const unsubscribe = onSnapshot(classesQuery, (snapshot) => {
			const classesData: Class[] = [];
			snapshot.forEach((doc) => {
				classesData.push({
					id: doc.id,
					...doc.data(),
				} as Class);
			});
			setClasses(classesData);
		});

		return () => unsubscribe();
	}, [currentUser]);

	// Listen to enrollments collection
	useEffect(() => {
		if (!currentUser) {
			setEnrollments([]);
			return;
		}

		const enrollmentsQuery = query(collection(db, 'enrollments'));
		const unsubscribe = onSnapshot(enrollmentsQuery, (snapshot) => {
			const enrollmentsData: Enrollment[] = [];
			snapshot.forEach((doc) => {
				enrollmentsData.push({
					id: doc.id,
					...doc.data(),
				} as Enrollment);
			});
			setEnrollments(enrollmentsData);
		});

		return () => unsubscribe();
	}, [currentUser]);

	// Listen to attendance records collection
	useEffect(() => {
		if (!currentUser) {
			setAttendanceRecords([]);
			return;
		}

		const attendanceQuery = query(collection(db, 'attendance'));
		const unsubscribe = onSnapshot(attendanceQuery, (snapshot) => {
			const attendanceData: AttendanceRecord[] = [];
			snapshot.forEach((doc) => {
				attendanceData.push({
					id: doc.id,
					...doc.data(),
				} as AttendanceRecord);
			});
			setAttendanceRecords(attendanceData);
		});

		return () => unsubscribe();
	}, [currentUser]);

	// Listen to chat messages collection
	useEffect(() => {
		if (!currentUser) {
			setChatMessages([]);
			return;
		}

		const chatQuery = query(collection(db, 'chatMessages'), orderBy('createdAt', 'asc'));
		const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
			const messagesData: ChatMessage[] = [];
			snapshot.forEach((doc) => {
				messagesData.push({
					id: doc.id,
					...doc.data(),
				} as ChatMessage);
			});
			setChatMessages(messagesData);
		});

		return () => unsubscribe();
	}, [currentUser]);

	// Class methods
	const addClass = async (classData: Omit<Class, 'id' | 'createdAt'>) => {
		try {
			await addDoc(collection(db, 'classes'), {
				...classData,
				createdAt: new Date().toISOString(),
			});
		} catch (error) {
			console.error('Error adding class:', error);
			throw error;
		}
	};

	const updateClass = async (id: string, updates: Partial<Class>) => {
		try {
			await updateDoc(doc(db, 'classes', id), updates);
		} catch (error) {
			console.error('Error updating class:', error);
			throw error;
		}
	};

	const getClassById = (id: string) => {
		return classes.find((cls) => cls.id === id);
	};

	const getTeacherClasses = (teacherId: string) => {
		return classes.filter((cls) => cls.teacherId === teacherId);
	};

	// Enrollment methods
	const enrollInClass = async (classId: string, studentId: string, studentName: string): Promise<boolean> => {
		// Check if already enrolled
		if (isStudentEnrolled(classId, studentId)) {
			return false;
		}

		try {
			await addDoc(collection(db, 'enrollments'), {
				classId,
				studentId,
				studentName,
				enrolledAt: new Date().toISOString(),
			});
			return true;
		} catch (error) {
			console.error('Error enrolling in class:', error);
			throw error;
		}
	};

	const getClassEnrollments = (classId: string) => {
		return enrollments.filter((enrollment) => enrollment.classId === classId);
	};

	const getStudentEnrollments = (studentId: string) => {
		return enrollments.filter((enrollment) => enrollment.studentId === studentId);
	};

	const isStudentEnrolled = (classId: string, studentId: string) => {
		return enrollments.some((enrollment) => enrollment.classId === classId && enrollment.studentId === studentId);
	};

	// Attendance methods
	const markAttendance = async (classId: string, studentId: string, studentName: string, status: 'present' | 'absent') => {
		const today = new Date().toISOString().split('T')[0];

		try {
			// Check if attendance already marked for today
			const attendanceQuery = query(collection(db, 'attendance'), where('classId', '==', classId), where('studentId', '==', studentId), where('date', '==', today));

			const querySnapshot = await getDocs(attendanceQuery);

			if (!querySnapshot.empty) {
				// Update existing record
				const existingDoc = querySnapshot.docs[0];
				await updateDoc(doc(db, 'attendance', existingDoc.id), {
					status,
					markedAt: new Date().toISOString(),
				});
			} else {
				// Create new record
				await addDoc(collection(db, 'attendance'), {
					classId,
					studentId,
					studentName,
					date: today,
					status,
					markedAt: new Date().toISOString(),
				});
			}
		} catch (error) {
			console.error('Error marking attendance:', error);
			throw error;
		}
	};

	const getClassAttendance = (classId: string) => {
		return attendanceRecords.filter((record) => record.classId === classId);
	};

	const getStudentAttendance = (studentId: string) => {
		return attendanceRecords.filter((record) => record.studentId === studentId);
	};

	// Chat methods
	const sendChatMessage = async (classId: string, message: string) => {
		if (!currentUser || !message.trim()) {
			return;
		}

		try {
			await addDoc(collection(db, 'chatMessages'), {
				classId,
				userId: currentUser.id,
				userName: currentUser.name,
				userRole: currentUser.role,
				message: message.trim(),
				createdAt: new Date().toISOString(),
			});
		} catch (error) {
			console.error('Error sending chat message:', error);
			throw error;
		}
	};

	const getClassChatMessages = (classId: string) => {
		return chatMessages.filter((msg) => msg.classId === classId);
	};

	return (
		<AppContext.Provider
			value={{
				currentUser,
				setCurrentUser,
				loading,
				classes,
				addClass,
				updateClass,
				getClassById,
				getTeacherClasses,
				enrollments,
				enrollInClass,
				getClassEnrollments,
				getStudentEnrollments,
				isStudentEnrolled,
				attendanceRecords,
				markAttendance,
				getClassAttendance,
				getStudentAttendance,
				chatMessages,
				sendChatMessage,
				getClassChatMessages,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export function useApp() {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error('useApp must be used within an AppProvider');
	}
	return context;
}
