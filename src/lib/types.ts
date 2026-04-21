export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  classId: string;
  className: string;
  rollNumber: string;
  gender: "Male" | "Female";
  dateOfBirth: string;
  address: string;
  parentName: string;
  parentPhone: string;
  admissionDate: string;
  fees: number;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  classIds: string[];
  qualification: string;
  joinDate: string;
  salary: number;
}

export interface ClassRoom {
  id: string;
  name: string;
  section: string;
  teacherId: string;
  studentIds: string[];
  capacity: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: "Present" | "Absent" | "Late";
}

export interface Exam {
  id: string;
  name: string;
  classId: string;
  subject: string;
  date: string;
  totalMarks: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: "Paid" | "Pending" | "Overdue";
  description: string;
  paidAmount: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: "High" | "Medium" | "Low";
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "Holiday" | "Exam" | "Event" | "Meeting";
  description: string;
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

export type UserRole = "admin" | "teacher";

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}
