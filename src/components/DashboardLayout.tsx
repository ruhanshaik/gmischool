import { useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { IconDashboard, IconStudents, IconTeacher, IconClass, IconAttendance, IconExam, IconFees, IconNotice, IconCalendar, IconSettings, IconMenu, IconClose, IconBell, IconChevronDown } from "@/components/icons";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: IconDashboard },
  { label: "Students", to: "/students", icon: IconStudents },
  { label: "Teachers", to: "/teachers", icon: IconTeacher, adminOnly: true },
  { label: "Classes", to: "/classes", icon: IconClass },
  { label: "Attendance", to: "/attendance", icon: IconAttendance },
  { label: "Exams & Results", to: "/exams", icon: IconExam },
  { label: "Fees", to: "/fees", icon: IconFees, adminOnly: true },
  { label: "Notices", to: "/notices", icon: IconNotice },
  { label: "Calendar", to: "/calendar", icon: IconCalendar },
  { label: "Settings", to: "/settings", icon: IconSettings },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, role, setRole, notifications, markNotificationRead } = useApp();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNav = navItems.filter(item => !item.adminOnly || role === "admin");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-border">
          <span className="text-lg font-semibold text-foreground tracking-tight">St. Jude's Academy</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-accent text-muted-foreground">
            <IconClose className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNav.map(item => {
            const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
            <span>Role:</span>
            <select value={role} onChange={e => setRole(e.target.value as "admin" | "teacher")} className="bg-accent text-accent-foreground rounded px-2 py-1 text-xs font-medium border-0 outline-none cursor-pointer">
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-accent text-muted-foreground">
              <IconMenu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-foreground hidden sm:block">
              {navItems.find(i => location.pathname === i.to || (i.to !== "/" && location.pathname.startsWith(i.to)))?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} className="relative p-2 rounded-lg hover:bg-accent text-muted-foreground">
                <IconBell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border"><span className="text-sm font-semibold text-foreground">Notifications</span></div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <button key={n.id} onClick={() => markNotificationRead(n.id)} className={`w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-accent transition-colors ${!n.read ? "bg-primary/5" : ""}`}>
                        <p className={`text-sm ${!n.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:block text-sm font-medium text-foreground">{user.name}</span>
                <IconChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/settings" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">Profile Settings</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Click outside to close dropdowns */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}
    </div>
  );
}
