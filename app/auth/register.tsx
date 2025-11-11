import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth, db } from '@/config/firebase';
import { UserRole } from '@/types';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleRegister = async () => {
		// Validation
		if (!name.trim()) {
			Alert.alert('Error', 'Please enter your name');
			return;
		}
		if (!email.trim()) {
			Alert.alert('Error', 'Please enter your email');
			return;
		}
		if (!password) {
			Alert.alert('Error', 'Please enter a password');
			return;
		}
		if (password.length < 6) {
			Alert.alert('Error', 'Password must be at least 6 characters long');
			return;
		}
		if (password !== confirmPassword) {
			Alert.alert('Error', 'Passwords do not match');
			return;
		}
		if (!selectedRole) {
			Alert.alert('Error', 'Please select a role');
			return;
		}

		setLoading(true);
		try {
			// Create user account
			const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
			const user = userCredential.user;

			// Create user profile in Firestore
			await setDoc(doc(db, 'users', user.uid), {
				id: user.uid,
				name: name.trim(),
				email: email.trim().toLowerCase(),
				role: selectedRole,
				createdAt: new Date().toISOString(),
			});

			// Navigate to main app
			router.replace('/(tabs)');
		} catch (error: any) {
			console.error('Registration error:', error);
			let errorMessage = 'Failed to create account. Please try again.';

			switch (error.code) {
				case 'auth/email-already-in-use':
					errorMessage = 'This email is already registered. Please login instead.';
					break;
				case 'auth/invalid-email':
					errorMessage = 'Invalid email address.';
					break;
				case 'auth/operation-not-allowed':
					errorMessage = 'Email/password accounts are not enabled. Please contact support.';
					break;
				case 'auth/weak-password':
					errorMessage = 'Password is too weak. Please use a stronger password.';
					break;
			}

			Alert.alert('Registration Failed', errorMessage);
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
							Create Account
						</ThemedText>
						<ThemedText style={styles.subtitle}>Sign up to get started</ThemedText>
					</View>

					<View style={styles.form}>
						<View style={styles.inputContainer}>
							<ThemedText style={styles.label}>Full Name</ThemedText>
							<TextInput style={styles.input} placeholder="Enter your name" placeholderTextColor="#999" value={name} onChangeText={setName} editable={!loading} />
						</View>

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

						<View style={styles.inputContainer}>
							<ThemedText style={styles.label}>Password</ThemedText>
							<TextInput style={styles.input} placeholder="At least 6 characters" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry editable={!loading} />
						</View>

						<View style={styles.inputContainer}>
							<ThemedText style={styles.label}>Confirm Password</ThemedText>
							<TextInput
								style={styles.input}
								placeholder="Re-enter your password"
								placeholderTextColor="#999"
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								secureTextEntry
								editable={!loading}
							/>
						</View>

						<View style={styles.roleContainer}>
							<ThemedText style={styles.label}>Select Role</ThemedText>
							<View style={styles.roleButtons}>
								<TouchableOpacity style={[styles.roleButton, selectedRole === 'teacher' && styles.roleButtonActive]} onPress={() => setSelectedRole('teacher')} disabled={loading}>
									<ThemedText style={[styles.roleButtonText, selectedRole === 'teacher' && styles.roleButtonTextActive]}>👨‍🏫 Teacher</ThemedText>
								</TouchableOpacity>

								<TouchableOpacity style={[styles.roleButton, selectedRole === 'student' && styles.roleButtonActive]} onPress={() => setSelectedRole('student')} disabled={loading}>
									<ThemedText style={[styles.roleButtonText, selectedRole === 'student' && styles.roleButtonTextActive]}>👨‍🎓 Student</ThemedText>
								</TouchableOpacity>
							</View>
						</View>

						<TouchableOpacity style={[styles.registerButton, loading && styles.disabledButton]} onPress={handleRegister} disabled={loading}>
							{loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.registerButtonText}>Create Account</ThemedText>}
						</TouchableOpacity>

						<View style={styles.loginContainer}>
							<ThemedText style={styles.loginText}>Already have an account? </ThemedText>
							<TouchableOpacity onPress={() => router.back()} disabled={loading}>
								<ThemedText style={styles.loginLink}>Login</ThemedText>
							</TouchableOpacity>
						</View>
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
		paddingTop: 40,
		paddingBottom: 40,
	},
	header: {
		marginBottom: 30,
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
	roleContainer: {
		gap: 8,
	},
	roleButtons: {
		flexDirection: 'row',
		gap: 15,
	},
	roleButton: {
		flex: 1,
		padding: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#ddd',
		backgroundColor: '#fff',
		alignItems: 'center',
	},
	roleButtonActive: {
		borderColor: '#007AFF',
		backgroundColor: '#E3F2FD',
	},
	roleButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#666',
	},
	roleButtonTextActive: {
		color: '#007AFF',
	},
	registerButton: {
		backgroundColor: '#007AFF',
		padding: 18,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 10,
	},
	disabledButton: {
		opacity: 0.6,
	},
	registerButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600',
	},
	loginContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
	},
	loginText: {
		fontSize: 14,
		opacity: 0.7,
	},
	loginLink: {
		fontSize: 14,
		color: '#007AFF',
		fontWeight: '600',
	},
});
