import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function TabLayout() {
	const { currentUser } = useApp();

	// If no user, return null - the root index.tsx will handle redirect
	if (!currentUser) {
		return null;
	}

	const isTeacher = currentUser.role === 'teacher';

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.light.tint,
				headerShown: true,
				tabBarButton: HapticTab,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: isTeacher ? 'My Classes' : 'Classes',
					headerTitle: isTeacher ? 'My Classes' : 'Available Classes',
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={26} color={color} />,
				}}
			/>
			{/* Teacher-only screens */}
			<Tabs.Screen
				name="add-class"
				options={{
					title: 'Add Class',
					headerTitle: 'Create New Class',
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={26} color={color} />,
					href: isTeacher ? undefined : null, // Hide from students
				}}
			/>
			<Tabs.Screen
				name="reports"
				options={{
					title: 'Reports',
					headerTitle: 'Attendance Reports',
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'list' : 'list-outline'} size={26} color={color} />,
					href: isTeacher ? undefined : null, // Hide from students
				}}
			/>

			{/* Student-only screen */}
			<Tabs.Screen
				name="my-classes"
				options={{
					title: 'My Classes',
					headerTitle: 'My Enrolled Classes',
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={26} color={color} />,
					href: isTeacher ? null : undefined, // Hide from teachers
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					headerTitle: 'Profile',
					tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={26} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					href: null,
				}}
			/>
		</Tabs>
	);
}
