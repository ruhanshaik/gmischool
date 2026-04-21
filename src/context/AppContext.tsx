import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Student, Teacher, ClassRoom, AttendanceRecord, Exam, ExamResult, FeeRecord, Notice, CalendarEvent, Notification, AuthUser, UserRole } from "@/lib/types";
import { initialStudents, initialTeachers, initialClasses, initialAttendance, initialExams, initialResults, initialFees, initialNotices, initialCalendarEvents, initialNotifications } from "@/lib/mock-data";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
}

function saveToStorage(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

interface AppContextType {
  user: AuthUser;
  role: UserRole;
  setRole: (r: UserRole) => void;
  isLoggedIn: boolean;
  logout: () => void;
  students: Student[];
  addStudent: (s: Omit<Student, "id">) => void;
  updateStudent: (s: Student) => void;
  deleteStudent: (id: string) => void;
  teachers: Teacher[];
  addTeacher: (t: Omit<Teacher, "id">) => void;
  updateTeacher: (t: Teacher) => void;
  deleteTeacher: (id: string) => void;
  classes: ClassRoom[];
  addClass: (c: Omit<ClassRoom, "id">) => void;
  updateClass: (c: ClassRoom) => void;
  deleteClass: (id: string) => void;
  attendance: AttendanceRecord[];
  markAttendance: (records: Omit<AttendanceRecord, "id">[]) => void;
  exams: Exam[];
  addExam: (e: Omit<Exam, "id">) => void;
  results: ExamResult[];
  addResult: (r: Omit<ExamResult, "id">) => void;
  updateResult: (r: ExamResult) => void;
  fees: FeeRecord[];
  addFee: (f: Omit<FeeRecord, "id">) => void;
  updateFee: (f: FeeRecord) => void;
  notices: Notice[];
  addNotice: (n: Omit<Notice, "id">) => void;
  updateNotice: (n: Notice) => void;
  deleteNotice: (id: string) => void;
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (e: Omit<CalendarEvent, "id">) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  generateStudentNumber: (classId: string, name: string) => string;
  generateTeacherId: () => string;
}

const AppContext = createContext<AppContextType | null>(null);

function getAuthFromStorage(): { email: string; role: UserRole; name: string } | null {
  try {
    const stored = localStorage.getItem("sms_auth");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const auth = getAuthFromStorage();
  const [role, setRole] = useState<UserRole>(auth?.role || "admin");
  const [students, setStudents] = useState<Student[]>(() => loadFromStorage("sms_students", initialStudents));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadFromStorage("sms_teachers", initialTeachers));
  const [classes, setClasses] = useState<ClassRoom[]>(() => loadFromStorage("sms_classes", initialClasses));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadFromStorage("sms_attendance", initialAttendance));
  const [exams, setExams] = useState<Exam[]>(() => loadFromStorage("sms_exams", initialExams));
  const [results, setResults] = useState<ExamResult[]>(() => loadFromStorage("sms_results", initialResults));
  const [fees, setFees] = useState<FeeRecord[]>(() => loadFromStorage("sms_fees", initialFees));
  const [notices, setNotices] = useState<Notice[]>(() => loadFromStorage("sms_notices", initialNotices));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => loadFromStorage("sms_calendar", initialCalendarEvents));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage("sms_notifications", initialNotifications));

  const isLoggedIn = !!auth;
  const user: AuthUser = { email: auth?.email || "", name: auth?.name || "Guest", role };

  const logout = () => {
    localStorage.removeItem("sms_auth");
    window.location.href = "/login";
  };

  useEffect(() => { saveToStorage("sms_students", students); }, [students]);
  useEffect(() => { saveToStorage("sms_teachers", teachers); }, [teachers]);
  useEffect(() => { saveToStorage("sms_classes", classes); }, [classes]);
  useEffect(() => { saveToStorage("sms_attendance", attendance); }, [attendance]);
  useEffect(() => { saveToStorage("sms_exams", exams); }, [exams]);
  useEffect(() => { saveToStorage("sms_results", results); }, [results]);
  useEffect(() => { saveToStorage("sms_fees", fees); }, [fees]);
  useEffect(() => { saveToStorage("sms_notices", notices); }, [notices]);
  useEffect(() => { saveToStorage("sms_calendar", calendarEvents); }, [calendarEvents]);
  useEffect(() => { saveToStorage("sms_notifications", notifications); }, [notifications]);

  const classCodeMap: Record<string, string> = {
    "c-baby": "BABY", "c-1st": "1ST", "c-2nd": "2ND", "c-3rd": "3RD", "c-4th": "4TH",
    "c-5th": "5TH", "c-6th": "6TH", "c-7th": "7TH", "c-8th": "8TH", "c-9th": "9TH",
    "c-10th": "10TH", "c-1pu": "1PU", "c-2pu": "2PU",
  };

  const generateStudentNumber = (classId: string, name: string) => {
    const cc = classCodeMap[classId] || classId.toUpperCase();
    const nameCode = name.replace(/\s/g, "").substring(0, 3).toUpperCase();
    const classStudents = students.filter(s => s.classId === classId);
    const seq = classStudents.length + 1;
    return `${cc}${nameCode}${String(seq).padStart(3, "0")}`;
  };

  const generateTeacherId = () => {
    const seq = teachers.length + 1;
    return `TEC${String(seq).padStart(3, "0")}`;
  };

  const addStudent = (s: Omit<Student, "id">) => setStudents(p => [...p, { ...s, id: genId() }]);
  const updateStudent = (s: Student) => setStudents(p => p.map(x => x.id === s.id ? s : x));
  const deleteStudent = (id: string) => setStudents(p => p.filter(x => x.id !== id));

  const addTeacher = (t: Omit<Teacher, "id">) => setTeachers(p => [...p, { ...t, id: genId() }]);
  const updateTeacher = (t: Teacher) => setTeachers(p => p.map(x => x.id === t.id ? t : x));
  const deleteTeacher = (id: string) => setTeachers(p => p.filter(x => x.id !== id));

  const addClass = (c: Omit<ClassRoom, "id">) => setClasses(p => [...p, { ...c, id: genId() }]);
  const updateClass = (c: ClassRoom) => setClasses(p => p.map(x => x.id === c.id ? c : x));
  const deleteClass = (id: string) => setClasses(p => p.filter(x => x.id !== id));

  const markAttendance = (records: Omit<AttendanceRecord, "id">[]) => {
    const newRecords = records.map(r => ({ ...r, id: genId() }));
    setAttendance(p => {
      const filtered = p.filter(a => !records.some(r => r.studentId === a.studentId && r.date === a.date && r.classId === a.classId));
      return [...filtered, ...newRecords];
    });
  };

  const addExam = (e: Omit<Exam, "id">) => setExams(p => [...p, { ...e, id: genId() }]);
  const addResult = (r: Omit<ExamResult, "id">) => setResults(p => [...p, { ...r, id: genId() }]);
  const updateResult = (r: ExamResult) => setResults(p => p.map(x => x.id === r.id ? r : x));

  const addFee = (f: Omit<FeeRecord, "id">) => setFees(p => [...p, { ...f, id: genId() }]);
  const updateFee = (f: FeeRecord) => setFees(p => p.map(x => x.id === f.id ? f : x));

  const addNotice = (n: Omit<Notice, "id">) => setNotices(p => [...p, { ...n, id: genId() }]);
  const updateNotice = (n: Notice) => setNotices(p => p.map(x => x.id === n.id ? n : x));
  const deleteNotice = (id: string) => setNotices(p => p.filter(x => x.id !== id));

  const addCalendarEvent = (e: Omit<CalendarEvent, "id">) => setCalendarEvents(p => [...p, { ...e, id: genId() }]);

  const markNotificationRead = (id: string) => setNotifications(p => p.map(x => x.id === id ? { ...x, read: true } : x));
  const markAllNotificationsRead = () => setNotifications(p => p.map(x => ({ ...x, read: true })));

  return (
    <AppContext.Provider value={{
      user, role, setRole, isLoggedIn, logout,
      students, addStudent, updateStudent, deleteStudent,
      teachers, addTeacher, updateTeacher, deleteTeacher,
      classes, addClass, updateClass, deleteClass,
      attendance, markAttendance,
      exams, addExam,
      results, addResult, updateResult,
      fees, addFee, updateFee,
      notices, addNotice, updateNotice, deleteNotice,
      calendarEvents, addCalendarEvent,
      notifications, markNotificationRead, markAllNotificationsRead,
      generateStudentNumber, generateTeacherId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
