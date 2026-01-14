import { AttendanceRecord, Class, Enrollment } from '@/types';
import { Platform } from 'react-native';

/**
 * Generate CSV content for attendance records
 */
export function generateAttendanceCSV(
	classData: Class,
	enrollments: Enrollment[],
	attendanceRecords: AttendanceRecord[]
): string {
	// CSV Header
	const header = ['Student Name', 'Student ID', 'Date', 'Status', 'Marked At'];
	
	// Get all unique dates sorted
	const dates = Array.from(new Set(attendanceRecords.map(r => r.date))).sort();
	
	// Create rows
	const rows: string[][] = [];
	
	// Add class info header
	rows.push([`Class: ${classData.name}`]);
	rows.push([`Teacher: ${classData.teacherName}`]);
	rows.push([`Report Generated: ${new Date().toLocaleString()}`]);
	rows.push([]); // Empty row
	
	// Add column headers
	rows.push(header);
	
	// Add attendance records sorted by date and student name
	const sortedRecords = attendanceRecords.sort((a, b) => {
		const dateCompare = b.date.localeCompare(a.date); // Most recent first
		if (dateCompare !== 0) return dateCompare;
		return a.studentName.localeCompare(b.studentName);
	});
	
	sortedRecords.forEach(record => {
		rows.push([
			record.studentName,
			record.studentId,
			new Date(record.date).toLocaleDateString(),
			record.status.toUpperCase(),
			new Date(record.markedAt).toLocaleString()
		]);
	});
	
	// Add summary statistics
	rows.push([]); // Empty row
	rows.push(['SUMMARY STATISTICS']);
	rows.push(['Total Students Enrolled', enrollments.length.toString()]);
	rows.push(['Total Attendance Records', attendanceRecords.length.toString()]);
	rows.push(['Total Present', attendanceRecords.filter(r => r.status === 'present').length.toString()]);
	rows.push(['Total Absent', attendanceRecords.filter(r => r.status === 'absent').length.toString()]);
	
	// Student-wise summary
	rows.push([]); // Empty row
	rows.push(['STUDENT-WISE SUMMARY']);
	rows.push(['Student Name', 'Total Classes', 'Present', 'Absent', 'Attendance %']);
	
	enrollments.forEach(enrollment => {
		const studentRecords = attendanceRecords.filter(r => r.studentId === enrollment.studentId);
		const present = studentRecords.filter(r => r.status === 'present').length;
		const absent = studentRecords.filter(r => r.status === 'absent').length;
		const total = present + absent;
		const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
		
		rows.push([
			enrollment.studentName,
			total.toString(),
			present.toString(),
			absent.toString(),
			`${percentage}%`
		]);
	});
	
	// Convert to CSV string
	return rows.map(row => 
		row.map(cell => {
			// Escape quotes and wrap in quotes if contains comma, quote, or newline
			const cellStr = cell.toString();
			if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
				return `"${cellStr.replace(/"/g, '""')}"`;
			}
			return cellStr;
		}).join(',')
	).join('\n');
}

/**
 * Download CSV file (Web only)
 */
export function downloadCSV(csvContent: string, filename: string): void {
	if (Platform.OS === 'web') {
		// Create blob and download link
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		
		link.setAttribute('href', url);
		link.setAttribute('download', filename);
		link.style.visibility = 'hidden';
		
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		
		// Clean up
		URL.revokeObjectURL(url);
	} else {
		// For mobile, we would need expo-file-system and expo-sharing
		console.warn('CSV download is currently only supported on web platform');
		alert('CSV download is currently only supported on web. Please use the web version to download reports.');
	}
}

/**
 * Generate filename for attendance CSV
 */
export function generateCSVFilename(className: string): string {
	const date = new Date().toISOString().split('T')[0];
	const sanitizedClassName = className.replace(/[^a-z0-9]/gi, '_').toLowerCase();
	return `attendance_${sanitizedClassName}_${date}.csv`;
}

