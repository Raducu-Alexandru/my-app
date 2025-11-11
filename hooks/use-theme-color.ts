/**
 * Always returns light theme colors for consistent appearance
 */

import { Colors } from '@/constants/theme';

export function useThemeColor(props: { light?: string; dark?: string }, colorName: keyof typeof Colors.light & keyof typeof Colors.dark) {
	// Always use light theme
	const theme = 'light';
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	} else {
		return Colors[theme][colorName];
	}
}
