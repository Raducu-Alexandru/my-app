import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
	const { currentUser, getTeacherClasses, getStudentEnrollments, getStudentAttendance } = useApp();
	const router = useRouter();

	if (!currentUser) {
		return null;
	}

	const isTeacher = currentUser.role === 'teacher';

	// Get stats based on role
	const stats = isTeacher
		? {
				classesCount: getTeacherClasses(currentUser.id).length,
				label: 'Classes Created',
		  }
		: {
				classesCount: getStudentEnrollments(currentUser.id).length,
				attendanceCount: getStudentAttendance(currentUser.id).filter((r) => r.status === 'present').length,
				label: 'Classes Enrolled',
		  };

	const handleLogout = async () => {
		Alert.alert('Logout', 'Are you sure you want to logout?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Logout',
				style: 'destructive',
				onPress: async () => {
					try {
						const { signOut } = await import('firebase/auth');
						const { auth } = await import('@/config/firebase');
						await signOut(auth);
						router.replace('/auth/login' as any);
					} catch (error) {
						console.error('Logout error:', error);
						Alert.alert('Error', 'Failed to logout. Please try again.');
					}
				},
			},
		]);
	};

	return (
		<ThemedView style={styles.container}>
			<ScrollView style={styles.scrollView}>
				{/* Profile Header */}
				<View style={styles.header}>
					<View style={styles.avatarContainer}>
						<ThemedText style={styles.avatarText}>{currentUser.name.charAt(0).toUpperCase()}</ThemedText>
					</View>
					<ThemedText type="title" style={styles.name}>
						{currentUser.name}
					</ThemedText>
					<View style={styles.roleBadge}>
						<ThemedText style={styles.roleText}>{isTeacher ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}</ThemedText>
					</View>
				</View>

				{/* Stats */}
				<View style={styles.statsContainer}>
					<View style={styles.statCard}>
						<ThemedText style={styles.statValue}>{stats.classesCount}</ThemedText>
						<ThemedText style={styles.statLabel}>{stats.label}</ThemedText>
					</View>
					{!isTeacher && (
						<View style={styles.statCard}>
							<ThemedText style={styles.statValue}>{stats.attendanceCount}</ThemedText>
							<ThemedText style={styles.statLabel}>Classes Attended</ThemedText>
						</View>
					)}
				</View>

				{/* Profile Info */}
				<View style={styles.infoContainer}>
					<View style={styles.infoCard}>
						<View style={styles.infoRow}>
							<ThemedText style={styles.infoLabel}>Name</ThemedText>
							<ThemedText style={styles.infoValue}>{currentUser.name}</ThemedText>
						</View>
						<View style={styles.divider} />
						<View style={styles.infoRow}>
							<ThemedText style={styles.infoLabel}>Role</ThemedText>
							<ThemedText style={styles.infoValue}>{isTeacher ? 'Teacher' : 'Student'}</ThemedText>
						</View>
						<View style={styles.divider} />
						<View style={styles.infoRow}>
							<ThemedText style={styles.infoLabel}>User ID</ThemedText>
							<ThemedText style={styles.infoValue}>{currentUser.id}</ThemedText>
						</View>
					</View>
				</View>

				{/* Actions */}
				<View style={styles.actionsContainer}>
					<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
						<ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
					</TouchableOpacity>
				</View>

				{/* App Info */}
				<View style={styles.appInfoContainer}>
					<ThemedText style={styles.appInfoText}>Attendance App v1.0.0</ThemedText>
					<ThemedText style={styles.appInfoSubtext}>Built with React Native & Expo</ThemedText>
				</View>
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
		alignItems: 'center',
		padding: 30,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	avatarContainer: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: '#007AFF',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 15,
	},
	avatarText: {
		fontSize: 40,
		fontWeight: 'bold',
		color: '#fff',
	},
	name: {
		marginBottom: 10,
	},
	roleBadge: {
		backgroundColor: '#E3F2FD',
		paddingHorizontal: 20,
		paddingVertical: 8,
		borderRadius: 20,
	},
	roleText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#007AFF',
	},
	statsContainer: {
		flexDirection: 'row',
		padding: 20,
		gap: 15,
	},
	statCard: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 12,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	statValue: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#007AFF',
		marginBottom: 5,
	},
	statLabel: {
		fontSize: 12,
		opacity: 0.6,
		textAlign: 'center',
	},
	infoContainer: {
		padding: 20,
	},
	infoCard: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
	},
	infoLabel: {
		fontSize: 16,
		fontWeight: '500',
		opacity: 0.6,
	},
	infoValue: {
		fontSize: 16,
		fontWeight: '600',
	},
	divider: {
		height: 1,
		backgroundColor: '#eee',
	},
	actionsContainer: {
		padding: 20,
	},
	logoutButton: {
		backgroundColor: '#F44336',
		padding: 16,
		borderRadius: 10,
		alignItems: 'center',
	},
	logoutButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	appInfoContainer: {
		alignItems: 'center',
		padding: 20,
		paddingBottom: 40,
	},
	appInfoText: {
		fontSize: 14,
		opacity: 0.6,
		marginBottom: 4,
	},
	appInfoSubtext: {
		fontSize: 12,
		opacity: 0.4,
	},
});
