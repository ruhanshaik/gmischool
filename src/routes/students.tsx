import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { PageHeader, SearchInput, DataTable, PrimaryButton, Modal, FormField, FormInput, FormSelect, ConfirmDialog, Badge } from "@/components/ui-components";
import { IconPlus, IconEdit, IconTrash, IconEye } from "@/components/icons";
import type { Student } from "@/lib/types";

export const Route = createFileRoute("/students")({
  component: StudentsPage,
});

function StudentsPage() {
  const { students, classes, addStudent, updateStudent, deleteStudent, role } = useApp();
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", email: "", phone: "", classId: "", rollNumber: "", gender: "Male" as const, dateOfBirth: "", address: "", parentName: "", parentPhone: "" });

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchClass = !classFilter || s.classId === classFilter;
    return matchSearch && matchClass;
  });

  const openAdd = () => {
    setForm({ name: "", email: "", phone: "", classId: classes[0]?.id || "", rollNumber: "", gender: "Male", dateOfBirth: "", address: "", parentName: "", parentPhone: "" });
    setEditStudent(null);
    setModalOpen(true);
  };

  const openEdit = (s: Student) => {
    setForm({ name: s.name, email: s.email, phone: s.phone, classId: s.classId, rollNumber: s.rollNumber, gender: s.gender, dateOfBirth: s.dateOfBirth, address: s.address, parentName: s.parentName, parentPhone: s.parentPhone });
    setEditStudent(s);
    setModalOpen(true);
  };

  const handleSave = () => {
    const cls = classes.find(c => c.id === form.classId);
    const className = cls ? `${cls.name} - ${cls.section}` : "";
    if (editStudent) {
      updateStudent({ ...editStudent, ...form, className });
    } else {
      addStudent({ ...form, className, admissionDate: new Date().toISOString().split("T")[0] });
    }
    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Student Management" action={role === "admin" ? <PrimaryButton onClick={openAdd}><IconPlus className="w-4 h-4" /> Add Student</PrimaryButton> : undefined} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search students..." />
        <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
        </select>
      </div>

      <DataTable headers={["Name", "Roll No", "Class", "Gender", "Phone", "Actions"]}>
        {filtered.map(s => (
          <tr key={s.id} className="hover:bg-muted/30 transition-colors">
            <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{s.name}</td>
            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{s.rollNumber}</td>
            <td className="px-4 py-3 whitespace-nowrap"><Badge>{s.className}</Badge></td>
            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{s.gender}</td>
            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{s.phone}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="flex items-center gap-1">
                <button onClick={() => setViewStudent(s)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground" title="View"><IconEye /></button>
                {role === "admin" && (
                  <>
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground" title="Edit"><IconEdit /></button>
                    <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive" title="Delete"><IconTrash /></button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* View Student Profile */}
      <Modal open={!!viewStudent} onClose={() => setViewStudent(null)} title="Student Profile" maxWidth="max-w-md">
        {viewStudent && (
          <div className="space-y-3 text-sm">
            <Detail label="Name" value={viewStudent.name} />
            <Detail label="Email" value={viewStudent.email} />
            <Detail label="Phone" value={viewStudent.phone} />
            <Detail label="Class" value={viewStudent.className} />
            <Detail label="Roll Number" value={viewStudent.rollNumber} />
            <Detail label="Gender" value={viewStudent.gender} />
            <Detail label="Date of Birth" value={viewStudent.dateOfBirth} />
            <Detail label="Address" value={viewStudent.address} />
            <Detail label="Parent Name" value={viewStudent.parentName} />
            <Detail label="Parent Phone" value={viewStudent.parentPhone} />
            <Detail label="Admission Date" value={viewStudent.admissionDate} />
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editStudent ? "Edit Student" : "Add Student"}>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <FormField label="Full Name"><FormInput value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} required /></FormField>
            <FormField label="Email"><FormInput value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} type="email" required /></FormField>
            <FormField label="Phone"><FormInput value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} required /></FormField>
            <FormField label="Roll Number"><FormInput value={form.rollNumber} onChange={v => setForm(p => ({ ...p, rollNumber: v }))} required /></FormField>
            <FormField label="Class"><FormSelect value={form.classId} onChange={v => setForm(p => ({ ...p, classId: v }))} options={classes.map(c => ({ value: c.id, label: `${c.name} - ${c.section}` }))} /></FormField>
            <FormField label="Gender"><FormSelect value={form.gender} onChange={v => setForm(p => ({ ...p, gender: v as "Male" | "Female" }))} options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]} /></FormField>
            <FormField label="Date of Birth"><FormInput value={form.dateOfBirth} onChange={v => setForm(p => ({ ...p, dateOfBirth: v }))} type="date" /></FormField>
            <FormField label="Parent Name"><FormInput value={form.parentName} onChange={v => setForm(p => ({ ...p, parentName: v }))} /></FormField>
            <FormField label="Parent Phone"><FormInput value={form.parentPhone} onChange={v => setForm(p => ({ ...p, parentPhone: v }))} /></FormField>
          </div>
          <FormField label="Address"><FormInput value={form.address} onChange={v => setForm(p => ({ ...p, address: v }))} /></FormField>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent">Cancel</button>
            <PrimaryButton type="submit">{editStudent ? "Update" : "Add"} Student</PrimaryButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) deleteStudent(deleteId); setDeleteId(null); }} title="Delete Student" message="Are you sure you want to delete this student? This action cannot be undone." />
    </DashboardLayout>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
