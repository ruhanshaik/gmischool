import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/ui-components";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

const attendanceData = [
  { day: "Mon", present: 92, absent: 8 },
  { day: "Tue", present: 88, absent: 12 },
  { day: "Wed", present: 95, absent: 5 },
  { day: "Thu", present: 90, absent: 10 },
  { day: "Fri", present: 87, absent: 13 },
];

const feesData = [
  { month: "Jan", collected: 180000, pending: 45000 },
  { month: "Feb", collected: 195000, pending: 30000 },
  { month: "Mar", collected: 210000, pending: 25000 },
  { month: "Apr", collected: 165000, pending: 60000 },
];

function DashboardPage() {
  const { students, teachers, fees, attendance, role, isLoggedIn } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn && typeof window !== "undefined") {
      navigate({ to: "/login" });
    }
  }, [isLoggedIn, navigate]);

  const totalRevenue = fees.filter(f => f.status === "Paid").reduce((sum, f) => sum + f.paidAmount, 0);
  const pendingFees = fees.reduce((sum, f) => sum + (f.amount - f.paidAmount), 0);
  const todayAttendance = attendance.filter(a => a.date === "2026-04-21");
  const presentToday = todayAttendance.filter(a => a.status === "Present").length;
  const totalToday = todayAttendance.length || 1;
  const attendanceRate = Math.round((presentToday / totalToday) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Welcome back, {role === "admin" ? "Admin" : "Teacher"}</h2>
          <p className="text-sm text-muted-foreground mt-1">Here is what is happening at St. Jude's Academy today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Students" value={students.length} sub={`${students.length} active`} color="primary" />
          <StatCard label="Total Teachers" value={teachers.length} sub={`${teachers.length} active`} color="info" />
          {role === "admin" && <StatCard label="Total Revenue" value={`${(totalRevenue / 1000).toFixed(0)}K`} sub={`${(pendingFees / 1000).toFixed(0)}K pending`} color="success" />}
          <StatCard label="Attendance Rate" value={`${attendanceRate}%`} sub="Today" color="warning" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Attendance Trends (This Week)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <Tooltip />
                <Line type="monotone" dataKey="present" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4 }} name="Present %" />
                <Line type="monotone" dataKey="absent" stroke="var(--destructive)" strokeWidth={2} dot={{ r: 4 }} name="Absent %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {role === "admin" && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Fees Collection (Monthly)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={feesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Bar dataKey="collected" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Collected" />
                  <Bar dataKey="pending" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <ActivityItem text="Aarav Sharma marked present in 10th Std-A" time="Today, 9:05 AM" />
            <ActivityItem text="Fee payment of 25,000 received from Priya Mehta" time="Today, 8:30 AM" />
            <ActivityItem text="Mid-Term results published for 10th Std" time="Yesterday, 4:15 PM" />
            <ActivityItem text="New notice: Annual Sports Day posted" time="Apr 18, 2026" />
            <ActivityItem text="Parent-Teacher Meeting scheduled" time="Apr 15, 2026" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">{text}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
