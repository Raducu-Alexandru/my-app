import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth, db } from '@/config/firebase';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async () => {
		if (!email.trim() || !password) {
			Alert.alert('Error', 'Please enter both email and password');
			return;
		}

		setLoading(true);
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
			const user = userCredential.user;

			// Get user profile from Firestore
			const userDoc = await getDoc(doc(db, 'users', user.uid));
			if (!userDoc.exists()) {
				Alert.alert('Error', 'User profile not found. Please contact support.');
				await auth.signOut();
				return;
			}

			// Navigate to main app
			router.replace('/(tabs)');
		} catch (error: any) {
			console.error('Login error:', error);
			let errorMessage = 'Failed to login. Please try again.';

			switch (error.code) {
				case 'auth/invalid-email':
					errorMessage = 'Invalid email address.';
					break;
				case 'auth/user-disabled':
					errorMessage = 'This account has been disabled.';
					break;
				case 'auth/user-not-found':
					errorMessage = 'No account found with this email.';
					break;
				case 'auth/wrong-password':
					errorMessage = 'Incorrect password.';
					break;
				case 'auth/invalid-credential':
					errorMessage = 'Invalid credentials. Please check your email and password.';
					break;
			}

			Alert.alert('Login Failed', errorMessage);
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
							Welcome Back!
						</ThemedText>
						<ThemedText style={styles.subtitle}>Login to your Attendance App account</ThemedText>
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

						<View style={styles.inputContainer}>
							<ThemedText style={styles.label}>Password</ThemedText>
							<TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry editable={!loading} />
						</View>

						<TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/auth/reset-password' as any)} disabled={loading}>
							<ThemedText style={styles.forgotPasswordText}>Forgot Password?</ThemedText>
						</TouchableOpacity>

						<TouchableOpacity style={[styles.loginButton, loading && styles.disabledButton]} onPress={handleLogin} disabled={loading}>
							{loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.loginButtonText}>Login</ThemedText>}
						</TouchableOpacity>

						<View style={styles.signupContainer}>
							<ThemedText style={styles.signupText}>Don&apos;t have an account? </ThemedText>
							<TouchableOpacity onPress={() => router.push('/auth/register' as any)} disabled={loading}>
								<ThemedText style={styles.signupLink}>Sign Up</ThemedText>
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
	forgotPassword: {
		alignSelf: 'flex-end',
	},
	forgotPasswordText: {
		color: '#007AFF',
		fontSize: 14,
	},
	loginButton: {
		backgroundColor: '#007AFF',
		padding: 18,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 10,
	},
	disabledButton: {
		opacity: 0.6,
	},
	loginButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600',
	},
	signupContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
	},
	signupText: {
		fontSize: 14,
		opacity: 0.7,
	},
	signupLink: {
		fontSize: 14,
		color: '#007AFF',
		fontWeight: '600',
	},
});
