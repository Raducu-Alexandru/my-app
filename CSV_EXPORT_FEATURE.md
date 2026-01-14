# CSV Export Feature Documentation

## Overview
Teachers can now download comprehensive attendance reports in CSV format. The CSV export feature is available in two locations and generates detailed reports with attendance data, statistics, and summaries.

## Features

### 📊 What's Included in the CSV Report

1. **Class Information**
   - Class name
   - Teacher name
   - Report generation timestamp

2. **Detailed Attendance Records**
   - Student name
   - Student ID
   - Date of attendance
   - Status (PRESENT/ABSENT)
   - Timestamp when attendance was marked
   - Sorted by date (most recent first) and student name

3. **Summary Statistics**
   - Total students enrolled
   - Total attendance records
   - Total present count
   - Total absent count

4. **Student-wise Summary**
   - Individual student statistics
   - Total classes attended
   - Present count
   - Absent count
   - Attendance percentage

## Where to Export CSV

### Option 1: Reports Screen
1. Login as a teacher
2. Navigate to the **"Reports"** tab
3. Select a class from the dropdown
4. Scroll to the **"Date-wise Records"** section
5. Click the **"📥 Export CSV"** button in the top-right

### Option 2: Class Details Screen
1. Login as a teacher
2. Navigate to **"My Classes"** or **"Classes"** tab
3. Select a class you teach
4. Click on the **"Attendance"** tab
5. Click the **"📥 Export CSV"** button next to "Today's Attendance"

## CSV File Format

### File Naming Convention
```
attendance_[class_name]_[date].csv
```

Example: `attendance_mathematics_101_2026-01-14.csv`

### Sample CSV Structure

```csv
Class: Mathematics 101
Teacher: Dr. Smith
Report Generated: 1/14/2026, 3:45:00 PM

Student Name,Student ID,Date,Status,Marked At
John Doe,user123,1/14/2026,PRESENT,1/14/2026, 9:05:23 AM
Jane Smith,user456,1/14/2026,PRESENT,1/14/2026, 9:06:15 AM
Bob Johnson,user789,1/14/2026,ABSENT,1/14/2026, 9:10:00 AM
John Doe,user123,1/13/2026,PRESENT,1/13/2026, 9:03:45 AM
Jane Smith,user456,1/13/2026,ABSENT,1/13/2026, 9:15:30 AM

SUMMARY STATISTICS
Total Students Enrolled,3
Total Attendance Records,5
Total Present,3
Total Absent,2

STUDENT-WISE SUMMARY
Student Name,Total Classes,Present,Absent,Attendance %
John Doe,2,2,0,100%
Jane Smith,2,1,1,50%
Bob Johnson,1,0,1,0%
```

## Platform Support

### ✅ Web Platform (Fully Supported)
- Direct browser download
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- No additional setup required
- File automatically downloads to default download folder

### ⚠️ Mobile Platforms (iOS/Android)
Currently, CSV export is **web-only**. When attempting to export on mobile:
- An alert will notify users that the feature is web-only
- Users should use the web version to download reports

**Future Enhancement**: Mobile support can be added using:
- `expo-file-system` for file creation
- `expo-sharing` for sharing/saving files
- Native share sheet integration

## Technical Implementation

### Files Created/Modified

1. **`utils/csvExport.ts`** (New)
   - `generateAttendanceCSV()`: Creates CSV content
   - `downloadCSV()`: Handles file download (web)
   - `generateCSVFilename()`: Creates standardized filename

2. **`app/(tabs)/reports.tsx`** (Modified)
   - Added export button in Date-wise Records section
   - Integrated CSV generation and download

3. **`app/class-details.tsx`** (Modified)
   - Added export button in Attendance tab
   - Available for class teachers only

### CSV Generation Logic

```typescript
// Generate CSV with proper escaping
- Handles commas in data (wraps in quotes)
- Escapes quotes in content (doubles them)
- Preserves newlines in cells
- UTF-8 encoding for international characters
```

## Usage Examples

### For Teachers

#### Scenario 1: End of Semester Report
1. Go to Reports tab
2. Select the class
3. Click "Export CSV"
4. Open in Excel/Google Sheets
5. Use for grade calculations or record keeping

#### Scenario 2: Quick Class Check
1. Open a specific class
2. Go to Attendance tab
3. Export CSV to review patterns
4. Share with administration if needed

#### Scenario 3: Data Analysis
1. Export CSV files for multiple classes
2. Combine in spreadsheet software
3. Create pivot tables for insights
4. Generate charts and visualizations

## Opening CSV Files

### Microsoft Excel
1. Open Excel
2. File → Open
3. Select the CSV file
4. Data will be automatically formatted in columns

### Google Sheets
1. Go to Google Sheets
2. File → Import
3. Upload the CSV file
4. Choose "Replace spreadsheet" or "Insert new sheet"
5. Click "Import data"

### Apple Numbers
1. Open Numbers
2. File → Open
3. Select the CSV file
4. Data will be imported automatically

## Data Privacy & Security

### Important Notes
- CSV files contain sensitive student information
- Store files securely
- Do not share publicly
- Follow your institution's data protection policies
- Delete files when no longer needed

### Best Practices
1. **Secure Storage**: Save CSV files in encrypted folders
2. **Access Control**: Only share with authorized personnel
3. **Retention Policy**: Delete old reports per policy
4. **Backup**: Keep backups in secure locations
5. **Audit Trail**: Track who downloads reports (future feature)

## Troubleshooting

### CSV Not Downloading
**Problem**: Click export but nothing happens  
**Solutions**:
- Check if you're on web platform (not mobile)
- Ensure browser allows downloads
- Check browser's download settings
- Try a different browser
- Check browser console for errors

### File Opens Incorrectly
**Problem**: Data appears in wrong columns  
**Solutions**:
- Use "Import" feature instead of direct open
- Specify comma as delimiter
- Ensure UTF-8 encoding is selected
- Try opening in Google Sheets first

### Empty CSV File
**Problem**: CSV downloads but has no data  
**Solutions**:
- Verify the class has attendance records
- Check if students are enrolled
- Ensure you're a teacher of the selected class
- Try refreshing the page and exporting again

### Special Characters Display Wrong
**Problem**: Names with accents or special characters appear garbled  
**Solutions**:
- When importing, select UTF-8 encoding
- Use Google Sheets (better UTF-8 support)
- In Excel: Data → Get Data → From Text/CSV → UTF-8

## Future Enhancements

Potential improvements for the CSV export feature:

### Short-term
- [ ] Date range filter (export specific date range)
- [ ] Format options (Excel .xlsx format)
- [ ] Email report directly to teacher
- [ ] Schedule automatic weekly/monthly reports

### Medium-term
- [ ] Mobile platform support (iOS/Android)
- [ ] Custom column selection
- [ ] Multiple class export (combined report)
- [ ] PDF export option

### Long-term
- [ ] Advanced filtering (by attendance %, date range, students)
- [ ] Custom report templates
- [ ] Automated analytics and insights
- [ ] Integration with school management systems
- [ ] Graphical reports with charts

## API Reference

### `generateAttendanceCSV()`
```typescript
function generateAttendanceCSV(
  classData: Class,
  enrollments: Enrollment[],
  attendanceRecords: AttendanceRecord[]
): string
```
Generates CSV content string from attendance data.

**Parameters:**
- `classData`: Class information object
- `enrollments`: Array of student enrollments
- `attendanceRecords`: Array of attendance records

**Returns:** CSV formatted string

### `downloadCSV()`
```typescript
function downloadCSV(
  csvContent: string,
  filename: string
): void
```
Triggers browser download of CSV file (web only).

**Parameters:**
- `csvContent`: CSV formatted string
- `filename`: Desired filename with .csv extension

### `generateCSVFilename()`
```typescript
function generateCSVFilename(
  className: string
): string
```
Creates standardized filename for CSV export.

**Parameters:**
- `className`: Name of the class

**Returns:** Formatted filename string

## Support

For issues or questions about CSV export:

1. **Check this documentation** for common solutions
2. **Browser Console**: Check for JavaScript errors (F12 → Console)
3. **Test on Web**: Ensure you're using web platform
4. **Try Different Browser**: Test in Chrome/Firefox/Safari
5. **Clear Cache**: Clear browser cache and try again

## Compliance Notes

When using CSV export feature, ensure compliance with:
- **FERPA** (Family Educational Rights and Privacy Act) - US
- **GDPR** (General Data Protection Regulation) - EU
- **COPPA** (Children's Online Privacy Protection Act) - US
- Local data protection regulations in your region

Always follow your institution's policies regarding student data handling and retention.

