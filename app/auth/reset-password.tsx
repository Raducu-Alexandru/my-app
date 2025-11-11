import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/config/firebase';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function ResetPasswordScreen() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleResetPassword = async () => {
		if (!email.trim()) {
			Alert.alert('Error', 'Please enter your email address');
			return;
		}

		setLoading(true);
		try {
			await sendPasswordResetEmail(auth, email.trim());
			Alert.alert('Success', 'Password reset email sent! Please check your inbox.', [
				{
					text: 'OK',
					onPress: () => router.back(),
				},
			]);
		} catch (error: any) {
			console.error('Reset password error:', error);
			let errorMessage = 'Failed to send reset email. Please try again.';

			switch (error.code) {
				case 'auth/invalid-email':
					errorMessage = 'Invalid email address.';
					break;
				case 'auth/user-not-found':
					errorMessage = 'No account found with this email.';
					break;
			}

			Alert.alert('Reset Failed', errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
				<ThemedView style={styles.content}>
					<View style={styles.header}>
						<ThemedText type="title" style={styles.title}>
							Reset Password
						</ThemedText>
						<ThemedText style={styles.subtitle}>Enter your email address and we&apos;ll send you a link to reset your password</ThemedText>
					</View>

					<View style={styles.form}>
						<View style={styles.inputContainer}>
							<ThemedText style={styles.label}>Email</ThemedText>
							<TextInput
								style={styles.input}
								placeholder="Enter your email"
								placeholderTextColor="#999"
								value={email}
								onChangeText={setEmail}
								autoCapitalize="none"
								keyboardType="email-address"
								editable={!loading}
							/>
						</View>

						<TouchableOpacity style={[styles.resetButton, loading && styles.disabledButton]} onPress={handleResetPassword} disabled={loading}>
							{loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.resetButtonText}>Send Reset Email</ThemedText>}
						</TouchableOpacity>

						<TouchableOpacity style={styles.backButton} onPress={() => router.back()} disabled={loading}>
							<ThemedText style={styles.backButtonText}>Back to Login</ThemedText>
						</TouchableOpacity>
					</View>
				</ThemedView>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
	},
	header: {
		marginBottom: 40,
		alignItems: 'center',
	},
	title: {
		fontSize: 32,
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		opacity: 0.7,
		textAlign: 'center',
		marginTop: 10,
	},
	form: {
		gap: 20,
	},
	inputContainer: {
		gap: 8,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 10,
		padding: 15,
		fontSize: 16,
		backgroundColor: '#fff',
	},
	resetButton: {
		backgroundColor: '#007AFF',
		padding: 18,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 10,
	},
	disabledButton: {
		opacity: 0.6,
	},
	resetButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600',
	},
	backButton: {
		padding: 15,
		alignItems: 'center',
	},
	backButtonText: {
		color: '#007AFF',
		fontSize: 16,
	},
});
