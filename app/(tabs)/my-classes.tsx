import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function MyClassesScreen() {
	const { currentUser, getStudentEnrollments, getClassById, getStudentAttendance } = useApp();
	const router = useRouter();

	if (!currentUser) {
		return null;
	}

	const enrollments = getStudentEnrollments(currentUser.id);
	const enrolledClasses = enrollments.map((enrollment) => getClassById(enrollment.classId)).filter((cls) => cls !== undefined);

	const attendanceRecords = getStudentAttendance(currentUser.id);

	const getClassAttendanceStats = (classId: string) => {
		const classRecords = attendanceRecords.filter((record) => record.classId === classId);
		const present = classRecords.filter((record) => record.status === 'present').length;
		const absent = classRecords.filter((record) => record.status === 'absent').length;
		const total = present + absent;
		const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

		return { present, absent, total, percentage };
	};

	const handleClassPress = (classId: string) => {
		router.push(`/class-details?id=${classId}` as any);
	};

	return (
		<ThemedView style={styles.container}>
			<ScrollView style={styles.scrollView}>
				{enrolledClasses.length === 0 ? (
					<View style={styles.emptyContainer}>
						<ThemedText style={styles.emptyText}>You haven&apos;t enrolled in any classes yet.</ThemedText>
						<ThemedText style={styles.emptySubtext}>Go to the Classes tab to browse and enroll in available classes.</ThemedText>
					</View>
				) : (
					<View style={styles.classesContainer}>
						{enrolledClasses.map((cls) => {
							if (!cls) return null;

							const stats = getClassAttendanceStats(cls.id);

							return (
								<TouchableOpacity key={cls.id} style={styles.classCard} onPress={() => handleClassPress(cls.id)}>
									<View style={styles.classHeader}>
										<ThemedText type="subtitle" style={styles.className}>
											{cls.name}
										</ThemedText>
										{cls.isActive && (
											<View style={styles.activeBadge}>
												<ThemedText style={styles.activeBadgeText}>Active</ThemedText>
											</View>
										)}
									</View>

									<ThemedText style={styles.classDescription}>{cls.description}</ThemedText>

									<View style={styles.classInfo}>
										<ThemedText style={styles.infoText}>👨‍🏫 {cls.teacherName}</ThemedText>
										<ThemedText style={styles.infoText}>
											📅 {cls.schedule.date} at {cls.schedule.time}
										</ThemedText>
									</View>

									{/* Attendance Stats */}
									{stats.total > 0 && (
										<View style={styles.attendanceContainer}>
											<View style={styles.attendanceHeader}>
												<ThemedText style={styles.attendanceTitle}>Your Attendance</ThemedText>
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

											<View style={styles.progressBarContainer}>
												<View
													style={[
														styles.progressBar,
														{ width: `${stats.percentage}%` },
														stats.percentage >= 75 ? styles.goodProgress : stats.percentage >= 50 ? styles.averageProgress : styles.poorProgress,
													]}
												/>
											</View>
										</View>
									)}
								</TouchableOpacity>
							);
						})}
					</View>
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
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 10,
	},
	emptySubtext: {
		textAlign: 'center',
		fontSize: 14,
		opacity: 0.6,
	},
	classesContainer: {
		padding: 15,
		gap: 15,
	},
	classCard: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	classHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	className: {
		flex: 1,
		fontSize: 18,
	},
	activeBadge: {
		backgroundColor: '#4CAF50',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	activeBadgeText: {
		color: '#fff',
		fontSize: 12,
		fontWeight: '600',
	},
	classDescription: {
		fontSize: 14,
		opacity: 0.7,
		marginBottom: 12,
	},
	classInfo: {
		gap: 6,
		marginBottom: 12,
	},
	infoText: {
		fontSize: 14,
		opacity: 0.8,
	},
	attendanceContainer: {
		marginTop: 12,
		padding: 12,
		backgroundColor: '#F5F5F5',
		borderRadius: 8,
		gap: 10,
	},
	attendanceHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	attendanceTitle: {
		fontSize: 14,
		fontWeight: '600',
	},
	percentageBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
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
		fontSize: 12,
	},
	statsRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	statItem: {
		alignItems: 'center',
	},
	statValue: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	statLabel: {
		fontSize: 11,
		opacity: 0.6,
		marginTop: 2,
	},
	progressBarContainer: {
		height: 6,
		backgroundColor: '#ddd',
		borderRadius: 3,
		overflow: 'hidden',
	},
	progressBar: {
		height: '100%',
		borderRadius: 3,
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
});
