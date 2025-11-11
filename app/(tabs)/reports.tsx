import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ReportsScreen() {
	const { currentUser, getTeacherClasses, getClassEnrollments, getClassAttendance } = useApp();
	const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

	if (!currentUser) {
		return null;
	}

	const teacherClasses = getTeacherClasses(currentUser.id);
	const selectedClass = selectedClassId ? teacherClasses.find((cls) => cls.id === selectedClassId) : null;

	const enrollments = selectedClassId ? getClassEnrollments(selectedClassId) : [];
	const attendanceRecords = selectedClassId ? getClassAttendance(selectedClassId) : [];

	// Calculate attendance statistics
	const getStudentAttendanceStats = (studentId: string) => {
		const studentRecords = attendanceRecords.filter((record) => record.studentId === studentId);
		const present = studentRecords.filter((record) => record.status === 'present').length;
		const absent = studentRecords.filter((record) => record.status === 'absent').length;
		const total = present + absent;
		const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

		return { present, absent, total, percentage };
	};

	return (
		<ThemedView style={styles.container}>
			<ScrollView style={styles.scrollView}>
				{teacherClasses.length === 0 ? (
					<View style={styles.emptyContainer}>
						<ThemedText style={styles.emptyText}>No classes yet. Create a class to view reports.</ThemedText>
					</View>
				) : (
					<>
						{/* Class Selector */}
						<View style={styles.selectorContainer}>
							<ThemedText style={styles.selectorLabel}>Select a class:</ThemedText>
							<View style={styles.classButtons}>
								{teacherClasses.map((cls) => (
									<TouchableOpacity key={cls.id} style={[styles.classButton, selectedClassId === cls.id && styles.selectedClassButton]} onPress={() => setSelectedClassId(cls.id)}>
										<ThemedText style={[styles.classButtonText, selectedClassId === cls.id && styles.selectedClassButtonText]}>{cls.name}</ThemedText>
									</TouchableOpacity>
								))}
							</View>
						</View>

						{/* Report Content */}
						{selectedClass && (
							<View style={styles.reportContainer}>
								<View style={styles.reportHeader}>
									<ThemedText type="subtitle">{selectedClass.name}</ThemedText>
									<ThemedText style={styles.reportSubtitle}>Attendance Report</ThemedText>
								</View>

								{/* Summary Stats */}
								<View style={styles.summaryContainer}>
									<View style={styles.summaryCard}>
										<ThemedText style={styles.summaryNumber}>{enrollments.length}</ThemedText>
										<ThemedText style={styles.summaryLabel}>Total Students</ThemedText>
									</View>
									<View style={styles.summaryCard}>
										<ThemedText style={styles.summaryNumber}>{attendanceRecords.filter((r) => r.status === 'present').length}</ThemedText>
										<ThemedText style={styles.summaryLabel}>Total Present</ThemedText>
									</View>
									<View style={styles.summaryCard}>
										<ThemedText style={styles.summaryNumber}>{attendanceRecords.filter((r) => r.status === 'absent').length}</ThemedText>
										<ThemedText style={styles.summaryLabel}>Total Absent</ThemedText>
									</View>
								</View>

								{/* Student-wise Report */}
								<View style={styles.studentReportContainer}>
									<ThemedText type="subtitle" style={styles.sectionTitle}>
										Student-wise Attendance
									</ThemedText>

									{enrollments.length === 0 ? (
										<ThemedText style={styles.emptyText}>No students enrolled</ThemedText>
									) : (
										enrollments.map((enrollment) => {
											const stats = getStudentAttendanceStats(enrollment.studentId);

											return (
												<View key={enrollment.id} style={styles.studentCard}>
													<View style={styles.studentHeader}>
														<ThemedText style={styles.studentName}>{enrollment.studentName}</ThemedText>
														<View style={[styles.percentageBadge, stats.percentage >= 75 ? styles.goodAttendance : stats.percentage >= 50 ? styles.averageAttendance : styles.poorAttendance]}>
															<ThemedText style={styles.percentageText}>{stats.percentage}%</ThemedText>
														</View>
													</View>

													<View style={styles.statsRow}>
														<View style={styles.statItem}>
															<ThemedText style={styles.statValue}>{stats.present}</ThemedText>
															<ThemedText style={styles.statLabel}>Present</ThemedText>
														</View>
														<View style={styles.statItem}>
															<ThemedText style={styles.statValue}>{stats.absent}</ThemedText>
															<ThemedText style={styles.statLabel}>Absent</ThemedText>
														</View>
														<View style={styles.statItem}>
															<ThemedText style={styles.statValue}>{stats.total}</ThemedText>
															<ThemedText style={styles.statLabel}>Total</ThemedText>
														</View>
													</View>

													{stats.total > 0 && (
														<View style={styles.progressBarContainer}>
															<View
																style={[
																	styles.progressBar,
																	{ width: `${stats.percentage}%` },
																	stats.percentage >= 75 ? styles.goodProgress : stats.percentage >= 50 ? styles.averageProgress : styles.poorProgress,
																]}
															/>
														</View>
													)}
												</View>
											);
										})
									)}
								</View>

								{/* Date-wise Records */}
								{attendanceRecords.length > 0 && (
									<View style={styles.dateReportContainer}>
										<ThemedText type="subtitle" style={styles.sectionTitle}>
											Date-wise Records
										</ThemedText>

										{Array.from(new Set(attendanceRecords.map((r) => r.date)))
											.sort()
											.reverse()
											.map((date) => {
												const dateRecords = attendanceRecords.filter((r) => r.date === date);
												const presentCount = dateRecords.filter((r) => r.status === 'present').length;

												return (
													<View key={date} style={styles.dateCard}>
														<View style={styles.dateHeader}>
															<ThemedText style={styles.dateText}>
																📅{' '}
																{new Date(date).toLocaleDateString('en-US', {
																	weekday: 'long',
																	year: 'numeric',
																	month: 'long',
																	day: 'numeric',
																})}
															</ThemedText>
															<ThemedText style={styles.dateCount}>
																{presentCount}/{dateRecords.length} present
															</ThemedText>
														</View>
													</View>
												);
											})}
									</View>
								)}
							</View>
						)}
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
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 40,
		marginTop: 100,
	},
	emptyText: {
		textAlign: 'center',
		fontSize: 16,
		opacity: 0.6,
	},
	selectorContainer: {
		padding: 20,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	selectorLabel: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 12,
	},
	classButtons: {
		gap: 10,
	},
	classButton: {
		padding: 15,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#ddd',
		backgroundColor: '#fff',
	},
	selectedClassButton: {
		borderColor: '#007AFF',
		backgroundColor: '#E3F2FD',
	},
	classButtonText: {
		fontSize: 16,
		fontWeight: '500',
		color: '#666',
	},
	selectedClassButtonText: {
		color: '#007AFF',
		fontWeight: '600',
	},
	reportContainer: {
		padding: 20,
		gap: 20,
	},
	reportHeader: {
		marginBottom: 10,
	},
	reportSubtitle: {
		fontSize: 14,
		opacity: 0.6,
		marginTop: 4,
	},
	summaryContainer: {
		flexDirection: 'row',
		gap: 10,
	},
	summaryCard: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	summaryNumber: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#007AFF',
	},
	summaryLabel: {
		fontSize: 12,
		opacity: 0.6,
		marginTop: 4,
		textAlign: 'center',
	},
	studentReportContainer: {
		gap: 12,
	},
	sectionTitle: {
		marginBottom: 8,
	},
	studentCard: {
		backgroundColor: '#fff',
		padding: 16,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		gap: 12,
	},
	studentHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	studentName: {
		fontSize: 16,
		fontWeight: '600',
	},
	percentageBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
	},
	goodAttendance: {
		backgroundColor: '#4CAF50',
	},
	averageAttendance: {
		backgroundColor: '#FF9800',
	},
	poorAttendance: {
		backgroundColor: '#F44336',
	},
	percentageText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 14,
	},
	statsRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	statItem: {
		alignItems: 'center',
	},
	statValue: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	statLabel: {
		fontSize: 12,
		opacity: 0.6,
		marginTop: 2,
	},
	progressBarContainer: {
		height: 8,
		backgroundColor: '#eee',
		borderRadius: 4,
		overflow: 'hidden',
	},
	progressBar: {
		height: '100%',
		borderRadius: 4,
	},
	goodProgress: {
		backgroundColor: '#4CAF50',
	},
	averageProgress: {
		backgroundColor: '#FF9800',
	},
	poorProgress: {
		backgroundColor: '#F44336',
	},
	dateReportContainer: {
		gap: 12,
	},
	dateCard: {
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	dateHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	dateText: {
		fontSize: 14,
		fontWeight: '500',
		flex: 1,
	},
	dateCount: {
		fontSize: 14,
		fontWeight: '600',
		color: '#007AFF',
	},
});
