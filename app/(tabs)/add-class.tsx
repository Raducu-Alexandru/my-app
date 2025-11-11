import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddClassScreen() {
	const { currentUser, addClass } = useApp();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');
	const [time, setTime] = useState('');

	const [loading, setLoading] = useState(false);

	const handleCreateClass = async () => {
		if (!currentUser) return;

		if (!name.trim()) {
			Alert.alert('Error', 'Please enter a class name');
			return;
		}
		if (!description.trim()) {
			Alert.alert('Error', 'Please enter a description');
			return;
		}
		if (!date.trim()) {
			Alert.alert('Error', 'Please enter a date (e.g., 2024-01-15)');
			return;
		}
		if (!time.trim()) {
			Alert.alert('Error', 'Please enter a time (e.g., 10:00 AM)');
			return;
		}

		setLoading(true);
		try {
			await addClass({
				name: name.trim(),
				description: description.trim(),
				teacherId: currentUser.id,
				teacherName: currentUser.name,
				schedule: {
					date: date.trim(),
					time: time.trim(),
				},
				isActive: false,
			});

			Alert.alert('Success', 'Class created successfully!');

			// Reset form
			setName('');
			setDescription('');
			setDate('');
			setTime('');
		} catch (error) {
			console.error('Error creating class:', error);
			Alert.alert('Error', 'Failed to create class. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<ThemedView style={styles.container}>
			<ScrollView style={styles.scrollView}>
				<View style={styles.form}>
					<View style={styles.inputContainer}>
						<ThemedText style={styles.label}>Class Name *</ThemedText>
						<TextInput style={styles.input} placeholder="e.g., Introduction to React Native" placeholderTextColor="#999" value={name} onChangeText={setName} />
					</View>

					<View style={styles.inputContainer}>
						<ThemedText style={styles.label}>Description *</ThemedText>
						<TextInput
							style={[styles.input, styles.textArea]}
							placeholder="Enter class description"
							placeholderTextColor="#999"
							value={description}
							onChangeText={setDescription}
							multiline
							numberOfLines={4}
						/>
					</View>

					<View style={styles.inputContainer}>
						<ThemedText style={styles.label}>Date *</ThemedText>
						<TextInput style={styles.input} placeholder="YYYY-MM-DD (e.g., 2024-01-15)" placeholderTextColor="#999" value={date} onChangeText={setDate} />
					</View>

					<View style={styles.inputContainer}>
						<ThemedText style={styles.label}>Time *</ThemedText>
						<TextInput style={styles.input} placeholder="e.g., 10:00 AM" placeholderTextColor="#999" value={time} onChangeText={setTime} />
					</View>

					<TouchableOpacity style={[styles.createButton, loading && styles.disabledButton]} onPress={handleCreateClass} disabled={loading}>
						{loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.createButtonText}>Create Class</ThemedText>}
					</TouchableOpacity>
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
	form: {
		padding: 20,
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
	textArea: {
		height: 100,
		textAlignVertical: 'top',
	},
	createButton: {
		backgroundColor: '#007AFF',
		padding: 18,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 10,
	},
	disabledButton: {
		opacity: 0.6,
	},
	createButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600',
	},
});
