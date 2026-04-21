import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { PageHeader, DataTable, PrimaryButton, Modal, FormField, FormInput, FormSelect, Badge } from "@/components/ui-components";
import { IconPlus, IconEdit } from "@/components/icons";
import type { ClassRoom } from "@/lib/types";

export const Route = createFileRoute("/classes")({
  component: ClassesPage,
});

function ClassesPage() {
  const { classes, teachers, students, addClass, updateClass, role } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editClass, setEditClass] = useState<ClassRoom | null>(null);
  const [assignOpen, setAssignOpen] = useState<ClassRoom | null>(null);
  const [form, setForm] = useState({ name: "", section: "", teacherId: "", capacity: "40" });

  const openAdd = () => { setForm({ name: "", section: "", teacherId: teachers[0]?.id || "", capacity: "40" }); setEditClass(null); setModalOpen(true); };
  const openEdit = (c: ClassRoom) => { setForm({ name: c.name, section: c.section, teacherId: c.teacherId, capacity: String(c.capacity) }); setEditClass(c); setModalOpen(true); };

  const handleSave = () => {
    const data = { name: form.name, section: form.section, teacherId: form.teacherId, capacity: Number(form.capacity), studentIds: editClass?.studentIds || [] };
    if (editClass) updateClass({ ...editClass, ...data });
    else addClass(data);
    setModalOpen(false);
  };

  const toggleStudentInClass = (studentId: string) => {
    if (!assignOpen) return;
    const updated = assignOpen.studentIds.includes(studentId)
      ? { ...assignOpen, studentIds: assignOpen.studentIds.filter(x => x !== studentId) }
      : { ...assignOpen, studentIds: [...assignOpen.studentIds, studentId] };
    updateClass(updated);
    setAssignOpen(updated);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Class Management" action={role === "admin" ? <PrimaryButton onClick={openAdd}><IconPlus className="w-4 h-4" /> Create Class</PrimaryButton> : undefined} />

      <DataTable headers={["Class", "Section", "Class Teacher", "Students", "Capacity", "Actions"]}>
        {classes.map(c => {
          const teacher = teachers.find(t => t.id === c.teacherId);
          return (
            <tr key={c.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
              <td className="px-4 py-3"><Badge>{c.section}</Badge></td>
              <td className="px-4 py-3 text-muted-foreground">{teacher?.name || "Unassigned"}</td>
              <td className="px-4 py-3 text-muted-foreground">{c.studentIds.length}</td>
              <td className="px-4 py-3 text-muted-foreground">{c.capacity}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  {role === "admin" && <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"><IconEdit /></button>}
                  {role === "admin" && <button onClick={() => setAssignOpen(c)} className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary hover:bg-primary/20">Assign</button>}
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editClass ? "Edit Class" : "Create Class"}>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <FormField label="Class Name"><FormInput value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} required placeholder="e.g. Grade 10" /></FormField>
          <FormField label="Section"><FormInput value={form.section} onChange={v => setForm(p => ({ ...p, section: v }))} required placeholder="e.g. A" /></FormField>
          <FormField label="Class Teacher"><FormSelect value={form.teacherId} onChange={v => setForm(p => ({ ...p, teacherId: v }))} options={teachers.map(t => ({ value: t.id, label: `${t.name} (${t.subject})` }))} /></FormField>
          <FormField label="Capacity"><FormInput value={form.capacity} onChange={v => setForm(p => ({ ...p, capacity: v }))} type="number" /></FormField>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent">Cancel</button>
            <PrimaryButton type="submit">{editClass ? "Update" : "Create"}</PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal open={!!assignOpen} onClose={() => setAssignOpen(null)} title={`Assign Students - ${assignOpen?.name} ${assignOpen?.section}`} maxWidth="max-w-md">
        {assignOpen && (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {students.map(s => (
              <label key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent cursor-pointer">
                <input type="checkbox" checked={assignOpen.studentIds.includes(s.id)} onChange={() => toggleStudentInClass(s.id)} className="w-4 h-4 rounded border-input text-primary focus:ring-ring" />
                <span className="text-sm text-foreground">{s.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{s.rollNumber}</span>
              </label>
            ))}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
