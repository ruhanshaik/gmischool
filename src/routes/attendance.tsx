import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { PageHeader, DataTable, PrimaryButton, FormSelect, Badge } from "@/components/ui-components";

export const Route = createFileRoute("/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const { students, classes, attendance, markAttendance } = useApp();
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState("2026-04-21");
  const [localStatus, setLocalStatus] = useState<Record<string, "Present" | "Absent" | "Late">>({});
  const [saved, setSaved] = useState(false);
  const [viewMode, setViewMode] = useState<"mark" | "report">("mark");

  const classStudents = students.filter(s => s.classId === selectedClass);

  const getExistingStatus = (studentId: string) => {
    const record = attendance.find(a => a.studentId === studentId && a.date === selectedDate && a.classId === selectedClass);
    return record?.status || "Present";
  };

  const getStatus = (studentId: string) => localStatus[studentId] || getExistingStatus(studentId);

  const handleSave = () => {
    const records = classStudents.map(s => ({
      studentId: s.id,
      classId: selectedClass,
      date: selectedDate,
      status: getStatus(s.id),
    }));
    markAttendance(records);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Report data
  const reportDates = [...new Set(attendance.filter(a => a.classId === selectedClass).map(a => a.date))].sort().reverse().slice(0, 7);

  return (
    <DashboardLayout>
      <PageHeader title="Attendance Management" action={
        <div className="flex gap-2">
          <button onClick={() => setViewMode("mark")} className={`px-3 py-1.5 text-sm rounded-lg ${viewMode === "mark" ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-accent"}`}>Mark</button>
          <button onClick={() => setViewMode("report")} className={`px-3 py-1.5 text-sm rounded-lg ${viewMode === "report" ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-accent"}`}>Report</button>
        </div>
      } />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <FormSelect value={selectedClass} onChange={v => { setSelectedClass(v); setLocalStatus({}); }} options={classes.map(c => ({ value: c.id, label: `${c.name} - ${c.section}` }))} />
        {viewMode === "mark" && (
          <input type="date" value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setLocalStatus({}); }} className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        )}
      </div>

      {viewMode === "mark" ? (
        <>
          <DataTable headers={["Roll No", "Student Name", "Status"]}>
            {classStudents.map(s => (
              <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-muted-foreground">{s.rollNumber}</td>
                <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {(["Present", "Absent", "Late"] as const).map(status => (
                      <button key={status} onClick={() => setLocalStatus(p => ({ ...p, [s.id]: status }))} className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${getStatus(s.id) === status
                        ? status === "Present" ? "bg-success text-success-foreground"
                        : status === "Absent" ? "bg-destructive text-destructive-foreground"
                        : "bg-warning text-warning-foreground"
                        : "border border-border text-muted-foreground hover:bg-accent"}`}>
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </DataTable>
          <div className="flex items-center gap-3 mt-4">
            <PrimaryButton onClick={handleSave}>Save Attendance</PrimaryButton>
            {saved && <span className="text-sm text-success font-medium">Attendance saved successfully</span>}
          </div>
        </>
      ) : (
        <DataTable headers={["Student", ...reportDates.map(d => d.slice(5))]}>
          {classStudents.map(s => (
            <tr key={s.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{s.name}</td>
              {reportDates.map(date => {
                const rec = attendance.find(a => a.studentId === s.id && a.date === date && a.classId === selectedClass);
                return (
                  <td key={date} className="px-4 py-3">
                    <Badge variant={rec?.status === "Present" ? "success" : rec?.status === "Absent" ? "destructive" : "warning"}>
                      {rec?.status || "-"}
                    </Badge>
                  </td>
                );
              })}
            </tr>
          ))}
        </DataTable>
      )}
    </DashboardLayout>
  );
}
