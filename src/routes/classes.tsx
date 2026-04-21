import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { PageHeader, DataTable, PrimaryButton, Modal, FormField, FormInput, FormSelect, ConfirmDialog, Badge } from "@/components/ui-components";
import { IconPlus, IconEdit, IconTrash } from "@/components/icons";
import type { ClassRoom } from "@/lib/types";

export const Route = createFileRoute("/classes")({
  component: ClassesPage,
});

function ClassesPage() {
  const { classes, teachers, students, addClass, updateClass, deleteClass, role } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editClass, setEditClass] = useState<ClassRoom | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", section: "", teacherId: "", capacity: "40" });

  const openAdd = () => { setForm({ name: "", section: "", teacherId: teachers[0]?.id || "", capacity: "40" }); setEditClass(null); setModalOpen(true); };
  const openEdit = (c: ClassRoom) => { setForm({ name: c.name, section: c.section, teacherId: c.teacherId, capacity: String(c.capacity) }); setEditClass(c); setModalOpen(true); };

  const handleSave = () => {
    const data = { name: form.name, section: form.section, teacherId: form.teacherId, capacity: Number(form.capacity), studentIds: editClass?.studentIds || [] };
    if (editClass) updateClass({ ...editClass, ...data });
    else addClass(data);
    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Class Management" action={role === "admin" ? <PrimaryButton onClick={openAdd}><IconPlus className="w-4 h-4" /> Create Class</PrimaryButton> : undefined} />

      <DataTable headers={["Class", "Section", "Class Teacher", "Students", "Capacity", "Actions"]}>
        {classes.map(c => {
          const teacher = teachers.find(t => t.id === c.teacherId);
          const studentCount = students.filter(s => s.classId === c.id).length;
          return (
            <tr key={c.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
              <td className="px-4 py-3"><Badge>{c.section}</Badge></td>
              <td className="px-4 py-3 text-muted-foreground">{teacher?.name || "Unassigned"}</td>
              <td className="px-4 py-3 text-muted-foreground">{studentCount}</td>
              <td className="px-4 py-3 text-muted-foreground">{c.capacity}</td>
              <td className="px-4 py-3">
                {role === "admin" && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"><IconEdit /></button>
                    <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive"><IconTrash /></button>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </DataTable>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editClass ? "Edit Class" : "Create Class"}>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <FormField label="Class Name"><FormInput value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} required placeholder="e.g. 5th Std" /></FormField>
          <FormField label="Section"><FormInput value={form.section} onChange={v => setForm(p => ({ ...p, section: v }))} required placeholder="e.g. A" /></FormField>
          <FormField label="Class Teacher"><FormSelect value={form.teacherId} onChange={v => setForm(p => ({ ...p, teacherId: v }))} options={teachers.map(t => ({ value: t.id, label: `${t.name} (${t.subject})` }))} /></FormField>
          <FormField label="Capacity"><FormInput value={form.capacity} onChange={v => setForm(p => ({ ...p, capacity: v }))} type="number" /></FormField>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent">Cancel</button>
            <PrimaryButton type="submit">{editClass ? "Update" : "Create"}</PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) deleteClass(deleteId); setDeleteId(null); }} title="Delete Class" message="Are you sure you want to delete this class?" />
    </DashboardLayout>
  );
}
