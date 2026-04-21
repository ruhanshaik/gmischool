import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/index";
import StudentsPage from "@/pages/students";
import TeachersPage from "@/pages/teachers";
import ClassesPage from "@/pages/classes";
import AttendancePage from "@/pages/attendance";
import ExamsPage from "@/pages/exams";
import FeesPage from "@/pages/fees";
import NoticesPage from "@/pages/notices";
import CalendarPage from "@/pages/calendar";
import SettingsPage from "@/pages/settings";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="/students" element={<StudentsPage />} />
      <Route path="/teachers" element={<TeachersPage />} />
      <Route path="/classes" element={<ClassesPage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/exams" element={<ExamsPage />} />
      <Route path="/fees" element={<FeesPage />} />
      <Route path="/notices" element={<NoticesPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}
