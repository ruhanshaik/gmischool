import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { PageHeader, PrimaryButton, Modal, FormField, FormInput, FormSelect, Badge } from "@/components/ui-components";
import { IconPlus } from "@/components/icons";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function CalendarPage() {
  const { calendarEvents, addCalendarEvent, role } = useApp();
  const [currentMonth, setCurrentMonth] = useState(3); // April
  const [currentYear] = useState(2026);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", type: "Event" as const, description: "" });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarEvents.filter(e => e.date === dateStr);
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "Holiday": return "destructive";
      case "Exam": return "warning";
      case "Event": return "success";
      case "Meeting": return "default";
      default: return "default";
    }
  };

  const handleAdd = () => {
    addCalendarEvent(form);
    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Academic Calendar" action={role === "admin" ? <PrimaryButton onClick={() => { setForm({ title: "", date: "", type: "Event", description: "" }); setModalOpen(true); }}><IconPlus className="w-4 h-4" /> Add Event</PrimaryButton> : undefined} />

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <button onClick={() => setCurrentMonth(p => p > 0 ? p - 1 : 11)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h3 className="text-base font-semibold text-foreground">{months[currentMonth]} {currentYear}</h3>
          <button onClick={() => setCurrentMonth(p => p < 11 ? p + 1 : 0)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-7">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="text-center py-2 text-xs font-medium text-muted-foreground border-b border-border">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="p-2 border-b border-r border-border min-h-[80px]" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const events = getEventsForDay(day);
            const isToday = day === 21 && currentMonth === 3;
            return (
              <div key={day} className={`p-2 border-b border-r border-border min-h-[80px] ${isToday ? "bg-primary/5" : ""}`}>
                <span className={`text-xs font-medium ${isToday ? "text-primary" : "text-foreground"}`}>{day}</span>
                <div className="mt-1 space-y-0.5">
                  {events.map(ev => (
                    <div key={ev.id} className="text-[10px] truncate" title={ev.title}>
                      <Badge variant={typeColor(ev.type)}>{ev.title}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="mt-6 bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {calendarEvents.sort((a, b) => a.date.localeCompare(b.date)).filter(e => e.date >= "2026-04-21").slice(0, 8).map(e => (
            <div key={e.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className="w-12 text-center shrink-0">
                <p className="text-lg font-bold text-foreground">{e.date.split("-")[2]}</p>
                <p className="text-[10px] text-muted-foreground uppercase">{months[Number(e.date.split("-")[1]) - 1]?.slice(0, 3)}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.description}</p>
              </div>
              <Badge variant={typeColor(e.type)}>{e.type}</Badge>
            </div>
          ))}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Calendar Event">
        <form onSubmit={e => { e.preventDefault(); handleAdd(); }}>
          <FormField label="Title"><FormInput value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} required /></FormField>
          <FormField label="Date"><FormInput value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} type="date" required /></FormField>
          <FormField label="Type"><FormSelect value={form.type} onChange={v => setForm(p => ({ ...p, type: v as any }))} options={[{ value: "Holiday", label: "Holiday" }, { value: "Exam", label: "Exam" }, { value: "Event", label: "Event" }, { value: "Meeting", label: "Meeting" }]} /></FormField>
          <FormField label="Description"><FormInput value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} /></FormField>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent">Cancel</button>
            <PrimaryButton type="submit">Add Event</PrimaryButton>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
