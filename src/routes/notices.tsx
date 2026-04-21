import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { PageHeader, PrimaryButton, Modal, FormField, FormInput, FormSelect, FormTextarea, Badge, ConfirmDialog } from "@/components/ui-components";
import { IconPlus, IconEdit, IconTrash } from "@/components/icons";
import type { Notice } from "@/lib/types";

export const Route = createFileRoute("/notices")({
  component: NoticesPage,
});

function NoticesPage() {
  const { notices, addNotice, updateNotice, deleteNotice, role } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editNotice, setEditNotice] = useState<Notice | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", author: "", priority: "Medium" as "High" | "Medium" | "Low" });

  const openAdd = () => { setForm({ title: "", content: "", author: "", priority: "Medium" }); setEditNotice(null); setModalOpen(true); };
  const openEdit = (n: Notice) => { setForm({ title: n.title, content: n.content, author: n.author, priority: n.priority }); setEditNotice(n); setModalOpen(true); };

  const handleSave = () => {
    const data = { ...form, date: editNotice?.date || new Date().toISOString().split("T")[0] };
    if (editNotice) updateNotice({ ...editNotice, ...data });
    else addNotice(data);
    setModalOpen(false);
  };

  const priorityVariant = (p: string) => p === "High" ? "destructive" : p === "Medium" ? "warning" : "default";

  return (
    <DashboardLayout>
      <PageHeader title="Notices & Announcements" action={role === "admin" ? <PrimaryButton onClick={openAdd}><IconPlus className="w-4 h-4" /> Add Notice</PrimaryButton> : undefined} />

      <div className="space-y-4">
        {notices.sort((a, b) => b.date.localeCompare(a.date)).map(n => (
          <div key={n.id} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-semibold text-foreground">{n.title}</h3>
                  <Badge variant={priorityVariant(n.priority)}>{n.priority}</Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{n.content}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span>By {n.author}</span>
                  <span>{n.date}</span>
                </div>
              </div>
              {role === "admin" && (
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(n)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"><IconEdit /></button>
                  <button onClick={() => setDeleteId(n.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive"><IconTrash /></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editNotice ? "Edit Notice" : "Add Notice"}>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <FormField label="Title"><FormInput value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} required /></FormField>
          <FormField label="Content"><FormTextarea value={form.content} onChange={v => setForm(p => ({ ...p, content: v }))} rows={4} /></FormField>
          <FormField label="Author"><FormInput value={form.author} onChange={v => setForm(p => ({ ...p, author: v }))} required /></FormField>
          <FormField label="Priority"><FormSelect value={form.priority} onChange={v => setForm(p => ({ ...p, priority: v as "High" | "Medium" | "Low" }))} options={[{ value: "High", label: "High" }, { value: "Medium", label: "Medium" }, { value: "Low", label: "Low" }]} /></FormField>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent">Cancel</button>
            <PrimaryButton type="submit">{editNotice ? "Update" : "Add"}</PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) deleteNotice(deleteId); setDeleteId(null); }} title="Delete Notice" message="Are you sure you want to delete this notice?" />
    </DashboardLayout>
  );
}
