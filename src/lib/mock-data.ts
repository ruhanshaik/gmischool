import type { Student, Teacher, ClassRoom, AttendanceRecord, Exam, ExamResult, FeeRecord, Notice, CalendarEvent, Notification } from './types';

export const initialStudents: Student[] = [
  { id: "s1", name: "Aarav Sharma", email: "aarav@stjudes.edu", phone: "9876543210", classId: "c1", className: "Grade 10 - A", rollNumber: "1001", gender: "Male", dateOfBirth: "2009-03-15", address: "12 Park Lane, Mumbai", parentName: "Rajesh Sharma", parentPhone: "9876543200", admissionDate: "2022-04-01" },
  { id: "s2", name: "Priya Mehta", email: "priya@stjudes.edu", phone: "9876543211", classId: "c1", className: "Grade 10 - A", rollNumber: "1002", gender: "Female", dateOfBirth: "2009-07-22", address: "45 Hill Road, Mumbai", parentName: "Sunil Mehta", parentPhone: "9876543201", admissionDate: "2022-04-01" },
  { id: "s3", name: "Rohan Patel", email: "rohan@stjudes.edu", phone: "9876543212", classId: "c2", className: "Grade 10 - B", rollNumber: "1003", gender: "Male", dateOfBirth: "2009-01-10", address: "78 Lake View, Mumbai", parentName: "Amit Patel", parentPhone: "9876543202", admissionDate: "2022-04-01" },
  { id: "s4", name: "Ananya Reddy", email: "ananya@stjudes.edu", phone: "9876543213", classId: "c2", className: "Grade 10 - B", rollNumber: "1004", gender: "Female", dateOfBirth: "2009-11-05", address: "23 Green Avenue, Mumbai", parentName: "Venkat Reddy", parentPhone: "9876543203", admissionDate: "2022-04-01" },
  { id: "s5", name: "Karthik Nair", email: "karthik@stjudes.edu", phone: "9876543214", classId: "c3", className: "Grade 9 - A", rollNumber: "901", gender: "Male", dateOfBirth: "2010-05-20", address: "56 River Road, Mumbai", parentName: "Suresh Nair", parentPhone: "9876543204", admissionDate: "2023-04-01" },
  { id: "s6", name: "Meera Iyer", email: "meera@stjudes.edu", phone: "9876543215", classId: "c3", className: "Grade 9 - A", rollNumber: "902", gender: "Female", dateOfBirth: "2010-08-12", address: "89 Sunset Blvd, Mumbai", parentName: "Ganesh Iyer", parentPhone: "9876543205", admissionDate: "2023-04-01" },
  { id: "s7", name: "Vikram Singh", email: "vikram@stjudes.edu", phone: "9876543216", classId: "c4", className: "Grade 9 - B", rollNumber: "903", gender: "Male", dateOfBirth: "2010-02-28", address: "34 Oak Street, Mumbai", parentName: "Harpreet Singh", parentPhone: "9876543206", admissionDate: "2023-04-01" },
  { id: "s8", name: "Sanya Gupta", email: "sanya@stjudes.edu", phone: "9876543217", classId: "c4", className: "Grade 9 - B", rollNumber: "904", gender: "Female", dateOfBirth: "2010-09-14", address: "67 Maple Drive, Mumbai", parentName: "Ravi Gupta", parentPhone: "9876543207", admissionDate: "2023-04-01" },
  { id: "s9", name: "Arjun Das", email: "arjun@stjudes.edu", phone: "9876543218", classId: "c1", className: "Grade 10 - A", rollNumber: "1005", gender: "Male", dateOfBirth: "2009-06-30", address: "90 Elm Road, Mumbai", parentName: "Bikash Das", parentPhone: "9876543208", admissionDate: "2022-04-01" },
  { id: "s10", name: "Divya Joshi", email: "divya@stjudes.edu", phone: "9876543219", classId: "c2", className: "Grade 10 - B", rollNumber: "1006", gender: "Female", dateOfBirth: "2009-12-01", address: "12 Cedar Lane, Mumbai", parentName: "Mahesh Joshi", parentPhone: "9876543209", admissionDate: "2022-04-01" },
  { id: "s11", name: "Nikhil Banerjee", email: "nikhil@stjudes.edu", phone: "9876543220", classId: "c3", className: "Grade 9 - A", rollNumber: "905", gender: "Male", dateOfBirth: "2010-04-18", address: "45 Pine Street, Mumbai", parentName: "Arun Banerjee", parentPhone: "9876543210", admissionDate: "2023-04-01" },
  { id: "s12", name: "Ishita Kapoor", email: "ishita@stjudes.edu", phone: "9876543221", classId: "c4", className: "Grade 9 - B", rollNumber: "906", gender: "Female", dateOfBirth: "2010-07-25", address: "78 Birch Road, Mumbai", parentName: "Deepak Kapoor", parentPhone: "9876543211", admissionDate: "2023-04-01" },
];

export const initialTeachers: Teacher[] = [
  { id: "t1", name: "Mr. Harrison", email: "harrison@stjudes.edu", phone: "9800000001", subject: "Mathematics", classIds: ["c1", "c2"], qualification: "M.Sc Mathematics", joinDate: "2018-06-15", salary: 65000 },
  { id: "t2", name: "Mrs. Fernandez", email: "fernandez@stjudes.edu", phone: "9800000002", subject: "English", classIds: ["c1", "c3"], qualification: "M.A English Literature", joinDate: "2019-07-01", salary: 60000 },
  { id: "t3", name: "Mr. Krishnan", email: "krishnan@stjudes.edu", phone: "9800000003", subject: "Science", classIds: ["c2", "c4"], qualification: "M.Sc Physics", joinDate: "2020-04-10", salary: 62000 },
  { id: "t4", name: "Mrs. Deshpande", email: "deshpande@stjudes.edu", phone: "9800000004", subject: "History", classIds: ["c3", "c4"], qualification: "M.A History", joinDate: "2017-08-20", salary: 58000 },
  { id: "t5", name: "Mr. Abraham", email: "abraham@stjudes.edu", phone: "9800000005", subject: "Computer Science", classIds: ["c1", "c2"], qualification: "M.Tech CS", joinDate: "2021-01-05", salary: 70000 },
];

export const initialClasses: ClassRoom[] = [
  { id: "c1", name: "Grade 10", section: "A", teacherId: "t1", studentIds: ["s1", "s2", "s9"], capacity: 40 },
  { id: "c2", name: "Grade 10", section: "B", teacherId: "t3", studentIds: ["s3", "s4", "s10"], capacity: 40 },
  { id: "c3", name: "Grade 9", section: "A", teacherId: "t2", studentIds: ["s5", "s6", "s11"], capacity: 40 },
  { id: "c4", name: "Grade 9", section: "B", teacherId: "t4", studentIds: ["s7", "s8", "s12"], capacity: 40 },
];

export const initialAttendance: AttendanceRecord[] = [
  { id: "a1", studentId: "s1", classId: "c1", date: "2026-04-21", status: "Present" },
  { id: "a2", studentId: "s2", classId: "c1", date: "2026-04-21", status: "Present" },
  { id: "a3", studentId: "s9", classId: "c1", date: "2026-04-21", status: "Absent" },
  { id: "a4", studentId: "s3", classId: "c2", date: "2026-04-21", status: "Present" },
  { id: "a5", studentId: "s4", classId: "c2", date: "2026-04-21", status: "Late" },
  { id: "a6", studentId: "s1", classId: "c1", date: "2026-04-20", status: "Present" },
  { id: "a7", studentId: "s2", classId: "c1", date: "2026-04-20", status: "Present" },
  { id: "a8", studentId: "s9", classId: "c1", date: "2026-04-20", status: "Present" },
  { id: "a9", studentId: "s1", classId: "c1", date: "2026-04-19", status: "Present" },
  { id: "a10", studentId: "s2", classId: "c1", date: "2026-04-19", status: "Absent" },
  { id: "a11", studentId: "s1", classId: "c1", date: "2026-04-18", status: "Late" },
  { id: "a12", studentId: "s2", classId: "c1", date: "2026-04-18", status: "Present" },
];

export const initialExams: Exam[] = [
  { id: "e1", name: "Mid-Term Examination", classId: "c1", subject: "Mathematics", date: "2026-03-15", totalMarks: 100 },
  { id: "e2", name: "Mid-Term Examination", classId: "c1", subject: "English", date: "2026-03-16", totalMarks: 100 },
  { id: "e3", name: "Mid-Term Examination", classId: "c2", subject: "Science", date: "2026-03-17", totalMarks: 100 },
  { id: "e4", name: "Unit Test 1", classId: "c3", subject: "Mathematics", date: "2026-02-20", totalMarks: 50 },
  { id: "e5", name: "Unit Test 1", classId: "c4", subject: "History", date: "2026-02-21", totalMarks: 50 },
];

export const initialResults: ExamResult[] = [
  { id: "r1", examId: "e1", studentId: "s1", marksObtained: 87 },
  { id: "r2", examId: "e1", studentId: "s2", marksObtained: 92 },
  { id: "r3", examId: "e1", studentId: "s9", marksObtained: 78 },
  { id: "r4", examId: "e2", studentId: "s1", marksObtained: 81 },
  { id: "r5", examId: "e2", studentId: "s2", marksObtained: 95 },
  { id: "r6", examId: "e3", studentId: "s3", marksObtained: 88 },
  { id: "r7", examId: "e3", studentId: "s4", marksObtained: 74 },
  { id: "r8", examId: "e4", studentId: "s5", marksObtained: 42 },
  { id: "r9", examId: "e4", studentId: "s6", marksObtained: 38 },
  { id: "r10", examId: "e5", studentId: "s7", marksObtained: 45 },
  { id: "r11", examId: "e5", studentId: "s8", marksObtained: 40 },
];

export const initialFees: FeeRecord[] = [
  { id: "f1", studentId: "s1", amount: 25000, dueDate: "2026-04-01", paidDate: "2026-03-28", status: "Paid", description: "Term 1 Tuition Fee" },
  { id: "f2", studentId: "s2", amount: 25000, dueDate: "2026-04-01", paidDate: "2026-04-01", status: "Paid", description: "Term 1 Tuition Fee" },
  { id: "f3", studentId: "s3", amount: 25000, dueDate: "2026-04-01", paidDate: null, status: "Pending", description: "Term 1 Tuition Fee" },
  { id: "f4", studentId: "s4", amount: 25000, dueDate: "2026-04-01", paidDate: null, status: "Overdue", description: "Term 1 Tuition Fee" },
  { id: "f5", studentId: "s5", amount: 22000, dueDate: "2026-04-01", paidDate: "2026-03-30", status: "Paid", description: "Term 1 Tuition Fee" },
  { id: "f6", studentId: "s6", amount: 22000, dueDate: "2026-04-01", paidDate: null, status: "Pending", description: "Term 1 Tuition Fee" },
  { id: "f7", studentId: "s7", amount: 22000, dueDate: "2026-04-01", paidDate: "2026-03-25", status: "Paid", description: "Term 1 Tuition Fee" },
  { id: "f8", studentId: "s8", amount: 22000, dueDate: "2026-04-01", paidDate: null, status: "Overdue", description: "Term 1 Tuition Fee" },
  { id: "f9", studentId: "s9", amount: 25000, dueDate: "2026-04-01", paidDate: "2026-03-29", status: "Paid", description: "Term 1 Tuition Fee" },
  { id: "f10", studentId: "s10", amount: 25000, dueDate: "2026-04-01", paidDate: null, status: "Pending", description: "Term 1 Tuition Fee" },
  { id: "f11", studentId: "s1", amount: 5000, dueDate: "2026-04-15", paidDate: null, status: "Pending", description: "Lab & Library Fee" },
  { id: "f12", studentId: "s2", amount: 5000, dueDate: "2026-04-15", paidDate: "2026-04-10", status: "Paid", description: "Lab & Library Fee" },
];

export const initialNotices: Notice[] = [
  { id: "n1", title: "Annual Sports Day", content: "The Annual Sports Day will be held on May 15th, 2026. All students are expected to participate in at least one event. Registration forms are available at the sports office.", date: "2026-04-18", author: "Principal", priority: "High" },
  { id: "n2", title: "Parent-Teacher Meeting", content: "Parent-Teacher Meeting for Grade 10 is scheduled for April 28th, 2026 from 10:00 AM to 1:00 PM. Please ensure your ward's report card is collected.", date: "2026-04-15", author: "Vice Principal", priority: "Medium" },
  { id: "n3", title: "Science Exhibition", content: "The inter-school Science Exhibition will be held on May 5th. Interested students should submit their project proposals to their science teachers by April 25th.", date: "2026-04-12", author: "Mr. Krishnan", priority: "Medium" },
  { id: "n4", title: "Fee Payment Reminder", content: "This is a reminder that Term 1 fees are due by April 30th. Late payment will incur a penalty of 2% per month. Please clear all dues at the earliest.", date: "2026-04-10", author: "Accounts Department", priority: "High" },
  { id: "n5", title: "Library Book Return", content: "All borrowed library books must be returned by April 22nd for the annual audit. Students with overdue books will not be issued new library cards.", date: "2026-04-08", author: "Librarian", priority: "Low" },
];

export const initialCalendarEvents: CalendarEvent[] = [
  { id: "ev1", title: "Republic Day", date: "2026-01-26", type: "Holiday", description: "National Holiday" },
  { id: "ev2", title: "Mid-Term Exams Begin", date: "2026-03-15", type: "Exam", description: "Mid-term examinations for all grades" },
  { id: "ev3", title: "Mid-Term Exams End", date: "2026-03-22", type: "Exam", description: "Last day of mid-term examinations" },
  { id: "ev4", title: "Parent-Teacher Meeting", date: "2026-04-28", type: "Meeting", description: "PTM for Grade 10 students" },
  { id: "ev5", title: "Science Exhibition", date: "2026-05-05", type: "Event", description: "Inter-school Science Exhibition" },
  { id: "ev6", title: "Annual Sports Day", date: "2026-05-15", type: "Event", description: "Annual Sports Day celebrations" },
  { id: "ev7", title: "Summer Break Begins", date: "2026-05-25", type: "Holiday", description: "Summer vacation starts" },
  { id: "ev8", title: "Independence Day", date: "2026-08-15", type: "Holiday", description: "National Holiday" },
  { id: "ev9", title: "Final Exams Begin", date: "2026-09-10", type: "Exam", description: "Final examinations for all grades" },
  { id: "ev10", title: "Staff Meeting", date: "2026-04-25", type: "Meeting", description: "Monthly staff review meeting" },
];

export const initialNotifications: Notification[] = [
  { id: "nt1", message: "3 students marked absent today in Grade 10-A", time: "10 minutes ago", read: false },
  { id: "nt2", message: "Fee payment received from Aarav Sharma", time: "1 hour ago", read: false },
  { id: "nt3", message: "New notice posted: Annual Sports Day", time: "2 hours ago", read: true },
  { id: "nt4", message: "Mid-Term results published for Grade 10", time: "1 day ago", read: true },
  { id: "nt5", message: "Parent-Teacher Meeting scheduled for April 28", time: "2 days ago", read: true },
];
