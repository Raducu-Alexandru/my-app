import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ClassesScreen() {
	const { currentUser, classes, getTeacherClasses, enrollInClass, isStudentEnrolled } = useApp();
	const router = useRouter();

	if (!currentUser) {
		return null;
	}

	const isTeacher = currentUser.role === 'teacher';
	const displayClasses = isTeacher ? getTeacherClasses(currentUser.id) : classes;

	const handleEnroll = async (classId: string) => {
		if (!currentUser) return;

		try {
			const success = await enrollInClass(classId, currentUser.id, currentUser.name);
			if (success) {
				Alert.alert('Success', 'You have been enrolled in this class!');
			} else {
				Alert.alert('Error', 'You are already enrolled in this class.');
			}
		} catch (error) {
			console.error('Error enrolling in class:', error);
			Alert.alert('Error', 'Failed to enroll in class. Please try again.');
		}
	};

	const handleClassPress = (classId: string) => {
		router.push(`/class-details?id=${classId}` as any);
	};

	return (
		<ThemedView style={styles.container}>
			<ScrollView style={styles.scrollView}>
				{displayClasses.length === 0 ? (
					<View style={styles.emptyContainer}>
						<ThemedText style={styles.emptyText}>{isTeacher ? 'No classes yet. Create your first class!' : 'No classes available at the moment.'}</ThemedText>
					</View>
				) : (
					<View style={styles.classesContainer}>
						{displayClasses.map((cls) => {
							const enrolled = !isTeacher && isStudentEnrolled(cls.id, currentUser.id);

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

									{!isTeacher && (
										<TouchableOpacity
											style={[styles.enrollButton, enrolled && styles.enrolledButton]}
											onPress={(e) => {
												e.stopPropagation();
												if (!enrolled) {
													handleEnroll(cls.id);
												}
											}}
											disabled={enrolled}
										>
											<ThemedText style={[styles.enrollButtonText, enrolled && styles.enrolledButtonText]}>{enrolled ? '✓ Enrolled' : 'Enroll'}</ThemedText>
										</TouchableOpacity>
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
		fontSize: 16,
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
	},
	infoText: {
		fontSize: 14,
		opacity: 0.8,
	},
	enrollButton: {
		backgroundColor: '#007AFF',
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 12,
	},
	enrolledButton: {
		backgroundColor: '#E8F5E9',
	},
	enrollButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 14,
	},
	enrolledButtonText: {
		color: '#4CAF50',
	},
});
