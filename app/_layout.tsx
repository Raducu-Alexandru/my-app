import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppProvider } from '@/context/AppContext';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	return (
		<AppProvider>
			<ThemeProvider value={DefaultTheme}>
				<Stack>
					<Stack.Screen name="index" options={{ headerShown: false }} />
					<Stack.Screen name="auth/login" options={{ headerShown: false }} />
					<Stack.Screen name="auth/register" options={{ headerShown: false }} />
					<Stack.Screen name="auth/reset-password" options={{ headerShown: false }} />
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="class-details" options={{ headerShown: false }} />
					<Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
				</Stack>
				<StatusBar style="dark" />
			</ThemeProvider>
		</AppProvider>
	);
}
