import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ClassDetailsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { currentUser, getClassById, getClassEnrollments, getClassAttendance, updateClass, markAttendance, isStudentEnrolled } = useApp();

	const [activeTab, setActiveTab] = useState<'details' | 'enrollments' | 'attendance'>('details');

	if (!currentUser || !id) {
		return null;
	}

	const classData = getClassById(id);
	if (!classData) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Class not found</ThemedText>
			</ThemedView>
		);
	}

	const isTeacher = currentUser.role === 'teacher' && classData.teacherId === currentUser.id;
	const enrollments = getClassEnrollments(id);
	const attendanceRecords = getClassAttendance(id);
	const isEnrolled = isStudentEnrolled(id, currentUser.id);

	const handleStartClass = async () => {
		try {
			await updateClass(id, { isActive: true });
			Alert.alert('Success', 'Class has been started!');
		} catch (error) {
			console.error('Error starting class:', error);
			Alert.alert('Error', 'Failed to start class. Please try again.');
		}
	};

	const handleEndClass = async () => {
		try {
			await updateClass(id, { isActive: false });
			Alert.alert('Success', 'Class has been ended!');
		} catch (error) {
			console.error('Error ending class:', error);
			Alert.alert('Error', 'Failed to end class. Please try again.');
		}
	};

	const handleMarkAttendance = async (studentId: string, studentName: string, status: 'present' | 'absent') => {
		try {
			await markAttendance(id, studentId, studentName, status);
			Alert.alert('Success', `Marked ${studentName} as ${status}`);
		} catch (error) {
			console.error('Error marking attendance:', error);
			Alert.alert('Error', 'Failed to mark attendance. Please try again.');
		}
	};

	const handleAttendClass = async () => {
		if (!classData.isActive) {
			Alert.alert('Error', 'This class is not currently active');
			return;
		}
		if (!isEnrolled) {
			Alert.alert('Error', 'You must be enrolled to attend this class');
			return;
		}
		try {
			await markAttendance(id, currentUser.id, currentUser.name, 'present');
			Alert.alert('Success', 'Your attendance has been recorded!');
		} catch (error) {
			console.error('Error attending class:', error);
			Alert.alert('Error', 'Failed to record attendance. Please try again.');
		}
	};

	const todayAttendance = attendanceRecords.filter((record) => record.date === new Date().toISOString().split('T')[0]);

	return (
		<ThemedView style={styles.container}>
			<Stack.Screen options={{ title: classData.name }} />

			<ScrollView style={styles.scrollView}>
				{/* Class Header */}
				<View style={styles.header}>
					<View style={styles.headerTop}>
						<ThemedText type="title">{classData.name}</ThemedText>
						{classData.isActive && (
							<View style={styles.activeBadge}>
								<ThemedText style={styles.activeBadgeText}>Active</ThemedText>
							</View>
						)}
					</View>
					<ThemedText style={styles.description}>{classData.description}</ThemedText>
					<View style={styles.infoRow}>
						<ThemedText style={styles.infoText}>👨‍🏫 {classData.teacherName}</ThemedText>
						<ThemedText style={styles.infoText}>
							📅 {classData.schedule.date} at {classData.schedule.time}
						</ThemedText>
					</View>
				</View>

				{/* Teacher Controls */}
				{isTeacher && (
					<View style={styles.controlsContainer}>
						{!classData.isActive ? (
							<TouchableOpacity style={styles.startButton} onPress={handleStartClass}>
								<ThemedText style={styles.buttonText}>▶️ Start Class</ThemedText>
							</TouchableOpacity>
						) : (
							<TouchableOpacity style={styles.endButton} onPress={handleEndClass}>
								<ThemedText style={styles.buttonText}>⏹️ End Class</ThemedText>
							</TouchableOpacity>
						)}
					</View>
				)}

				{/* Student Controls */}
				{!isTeacher && isEnrolled && (
					<View style={styles.controlsContainer}>
						<TouchableOpacity style={[styles.attendButton, !classData.isActive && styles.disabledButton]} onPress={handleAttendClass} disabled={!classData.isActive}>
							<ThemedText style={styles.buttonText}>{classData.isActive ? '✓ Mark Attendance' : 'Class Not Active'}</ThemedText>
						</TouchableOpacity>
					</View>
				)}

				{/* Tabs */}
				{isTeacher && (
					<>
						<View style={styles.tabsContainer}>
							<TouchableOpacity style={[styles.tab, activeTab === 'details' && styles.activeTab]} onPress={() => setActiveTab('details')}>
								<ThemedText style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>Details</ThemedText>
							</TouchableOpacity>
							<TouchableOpacity style={[styles.tab, activeTab === 'enrollments' && styles.activeTab]} onPress={() => setActiveTab('enrollments')}>
								<ThemedText style={[styles.tabText, activeTab === 'enrollments' && styles.activeTabText]}>Enrollments ({enrollments.length})</ThemedText>
							</TouchableOpacity>
							<TouchableOpacity style={[styles.tab, activeTab === 'attendance' && styles.activeTab]} onPress={() => setActiveTab('attendance')}>
								<ThemedText style={[styles.tabText, activeTab === 'attendance' && styles.activeTabText]}>Attendance</ThemedText>
							</TouchableOpacity>
						</View>

						{/* Tab Content */}
						<View style={styles.tabContent}>
							{activeTab === 'enrollments' && (
								<View style={styles.listContainer}>
									{enrollments.length === 0 ? (
										<ThemedText style={styles.emptyText}>No students enrolled yet</ThemedText>
									) : (
										enrollments.map((enrollment) => (
											<View key={enrollment.id} style={styles.listItem}>
												<ThemedText style={styles.studentName}>👨‍🎓 {enrollment.studentName}</ThemedText>
												<ThemedText style={styles.enrollDate}>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</ThemedText>
											</View>
										))
									)}
								</View>
							)}

							{activeTab === 'attendance' && (
								<View style={styles.listContainer}>
									<ThemedText type="subtitle" style={styles.sectionTitle}>
										Today&apos;s Attendance
									</ThemedText>
									{enrollments.length === 0 ? (
										<ThemedText style={styles.emptyText}>No students enrolled</ThemedText>
									) : (
										enrollments.map((enrollment) => {
											const todayRecord = todayAttendance.find((record) => record.studentId === enrollment.studentId);

											return (
												<View key={enrollment.id} style={styles.attendanceItem}>
													<View style={styles.attendanceInfo}>
														<ThemedText style={styles.studentName}>{enrollment.studentName}</ThemedText>
														{todayRecord && (
															<View style={[styles.statusBadge, todayRecord.status === 'present' ? styles.presentBadge : styles.absentBadge]}>
																<ThemedText style={styles.statusText}>{todayRecord.status === 'present' ? '✓ Present' : '✗ Absent'}</ThemedText>
															</View>
														)}
													</View>
													<View style={styles.attendanceButtons}>
														<TouchableOpacity style={[styles.markButton, styles.presentButton]} onPress={() => handleMarkAttendance(enrollment.studentId, enrollment.studentName, 'present')}>
															<ThemedText style={styles.markButtonText}>Present</ThemedText>
														</TouchableOpacity>
														<TouchableOpacity style={[styles.markButton, styles.absentButton]} onPress={() => handleMarkAttendance(enrollment.studentId, enrollment.studentName, 'absent')}>
															<ThemedText style={styles.markButtonText}>Absent</ThemedText>
														</TouchableOpacity>
													</View>
												</View>
											);
										})
									)}
								</View>
							)}
						</View>
					</>
				)}
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	header: {
		padding: 20,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	headerTop: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	description: {
		fontSize: 16,
		opacity: 0.7,
		marginBottom: 15,
	},
	infoRow: {
		gap: 8,
	},
	infoText: {
		fontSize: 14,
		opacity: 0.8,
	},
	activeBadge: {
		backgroundColor: '#4CAF50',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
	},
	activeBadgeText: {
		color: '#fff',
		fontSize: 12,
		fontWeight: '600',
	},
	controlsContainer: {
		padding: 20,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	startButton: {
		backgroundColor: '#4CAF50',
		padding: 16,
		borderRadius: 10,
		alignItems: 'center',
	},
	endButton: {
		backgroundColor: '#F44336',
		padding: 16,
		borderRadius: 10,
		alignItems: 'center',
	},
	attendButton: {
		backgroundColor: '#007AFF',
		padding: 16,
		borderRadius: 10,
		alignItems: 'center',
	},
	disabledButton: {
		backgroundColor: '#ccc',
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	tabsContainer: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	tab: {
		flex: 1,
		padding: 15,
		alignItems: 'center',
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
	},
	activeTab: {
		borderBottomColor: '#007AFF',
	},
	tabText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#666',
	},
	activeTabText: {
		color: '#007AFF',
		fontWeight: '600',
	},
	tabContent: {
		padding: 20,
	},
	listContainer: {
		gap: 12,
	},
	sectionTitle: {
		marginBottom: 15,
	},
	emptyText: {
		textAlign: 'center',
		opacity: 0.6,
		padding: 20,
	},
	listItem: {
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	studentName: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 4,
	},
	enrollDate: {
		fontSize: 12,
		opacity: 0.6,
	},
	attendanceItem: {
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		gap: 12,
	},
	attendanceInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	statusBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	presentBadge: {
		backgroundColor: '#E8F5E9',
	},
	absentBadge: {
		backgroundColor: '#FFEBEE',
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600',
	},
	attendanceButtons: {
		flexDirection: 'row',
		gap: 10,
	},
	markButton: {
		flex: 1,
		padding: 10,
		borderRadius: 8,
		alignItems: 'center',
	},
	presentButton: {
		backgroundColor: '#4CAF50',
	},
	absentButton: {
		backgroundColor: '#F44336',
	},
	markButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 14,
	},
});
