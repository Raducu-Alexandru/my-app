import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function IndexScreen() {
	const { currentUser, loading } = useApp();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (currentUser) {
				// User is authenticated, go to main app
				router.replace('/(tabs)');
			} else {
				// User is not authenticated, go to login
				router.replace('/auth/login' as any);
			}
		}
	}, [currentUser, loading, router]);

	// Show loading spinner while checking auth state
	return (
		<ThemedView style={styles.container}>
			<View style={styles.content}>
				<ThemedText type="title" style={styles.title}>
					Attendance App
				</ThemedText>
				<ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
				<ThemedText style={styles.loadingText}>Loading...</ThemedText>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	title: {
		textAlign: 'center',
		marginBottom: 40,
		fontSize: 32,
	},
	loader: {
		marginVertical: 20,
	},
	loadingText: {
		fontSize: 16,
		opacity: 0.6,
		marginTop: 10,
	},
});
