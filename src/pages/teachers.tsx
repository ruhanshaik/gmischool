import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { PageHeader, SearchInput, DataTable, PrimaryButton, Modal, FormField, FormInput, ConfirmDialog, Badge } from "@/components/ui-components";
import { IconPlus, IconEdit, IconTrash } from "@/components/icons";
import type { Teacher } from "@/lib/types";

export default function TeachersPage() {
  const { teachers, classes, addTeacher, updateTeacher, deleteTeacher, generateTeacherId } = useApp();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", qualification: "", salary: "0", classIds: [] as string[] });

  const filtered = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()));

  const previewId = !editTeacher ? generateTeacherId() : "";

  const openAdd = () => { setForm({ name: "", email: "", phone: "", subject: "", qualification: "", salary: "0", classIds: [] }); setEditTeacher(null); setModalOpen(true); };

  const openEdit = (t: Teacher) => { setForm({ name: t.name, email: t.email, phone: t.phone, subject: t.subject, qualification: t.qualification, salary: String(t.salary), classIds: t.classIds }); setEditTeacher(t); setModalOpen(true); };

  const handleSave = () => {
    const data = { name: form.name, email: form.email, phone: form.phone, subject: form.subject, qualification: form.qualification, salary: Number(form.salary), classIds: form.classIds, joinDate: editTeacher?.joinDate || new Date().toISOString().split("T")[0] };
    if (editTeacher) updateTeacher({ ...editTeacher, ...data });
    else addTeacher(data);
    setModalOpen(false);
  };

  const toggleClass = (cId: string) => {
    setForm(p => ({ ...p, classIds: p.classIds.includes(cId) ? p.classIds.filter(x => x !== cId) : [...p.classIds, cId] }));
  };

  return (
    <DashboardLayout>
      <PageHeader title="Teacher Management" action={<PrimaryButton onClick={openAdd}><IconPlus className="w-4 h-4" /> Add Teacher</PrimaryButton>} />
      <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Search teachers..." /></div>
      <DataTable headers={["Teacher ID", "Name", "Subject", "Email", "Phone", "Classes", "Actions"]}>
        {filtered.map(t => (
          <tr key={t.id} className="hover:bg-muted/30 transition-colors">
            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap font-mono text-xs">{t.id.toUpperCase()}</td>
            <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{t.name}</td>
            <td className="px-4 py-3 whitespace-nowrap"><Badge>{t.subject}</Badge></td>
            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{t.email}</td>
            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{t.phone}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="flex gap-1 flex-wrap">{t.classIds.map(cId => { const c = classes.find(x => x.id === cId); return c ? <Badge key={cId}>{c.name}-{c.section}</Badge> : null; })}</div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"><IconEdit /></button>
                <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive"><IconTrash /></button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTeacher ? "Edit Teacher" : "Add Teacher"}>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          {!editTeacher && previewId && (
            <FormField label="Teacher ID (Auto)">
              <div className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm text-foreground font-mono">{previewId}</div>
            </FormField>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField label="Full Name"><FormInput value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} required /></FormField>
            <FormField label="Email"><FormInput value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} type="email" required /></FormField>
            <FormField label="Phone"><FormInput value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} required /></FormField>
            <FormField label="Subject"><FormInput value={form.subject} onChange={v => setForm(p => ({ ...p, subject: v }))} required /></FormField>
            <FormField label="Qualification"><FormInput value={form.qualification} onChange={v => setForm(p => ({ ...p, qualification: v }))} /></FormField>
            <FormField label="Salary"><FormInput value={form.salary} onChange={v => setForm(p => ({ ...p, salary: v }))} type="number" /></FormField>
          </div>
          <FormField label="Assign to Classes">
            <div className="flex flex-wrap gap-2">
              {classes.map(c => (
                <button key={c.id} type="button" onClick={() => toggleClass(c.id)} className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.classIds.includes(c.id) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent"}`}>
                  {c.name} - {c.section}
                </button>
              ))}
            </div>
          </FormField>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent">Cancel</button>
            <PrimaryButton type="submit">{editTeacher ? "Update" : "Add"} Teacher</PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) deleteTeacher(deleteId); setDeleteId(null); }} title="Delete Teacher" message="Are you sure you want to delete this teacher?" />
    </DashboardLayout>
  );
}
