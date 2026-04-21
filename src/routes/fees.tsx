import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { PageHeader, DataTable, PrimaryButton, Modal, FormField, FormInput, FormSelect, StatCard, Badge } from "@/components/ui-components";
import { IconPlus } from "@/components/icons";

export const Route = createFileRoute("/fees")({
  component: FeesPage,
});

function FeesPage() {
  const { fees, students, addFee, updateFee } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ studentId: "", amount: "", dueDate: "", description: "" });

  const totalCollected = fees.filter(f => f.status === "Paid").reduce((s, f) => s + f.amount, 0);
  const totalPending = fees.filter(f => f.status === "Pending").reduce((s, f) => s + f.amount, 0);
  const totalOverdue = fees.filter(f => f.status === "Overdue").reduce((s, f) => s + f.amount, 0);

  const openAdd = () => { setForm({ studentId: students[0]?.id || "", amount: "", dueDate: "", description: "" }); setModalOpen(true); };

  const handleAdd = () => {
    addFee({ studentId: form.studentId, amount: Number(form.amount), dueDate: form.dueDate, paidDate: null, status: "Pending", description: form.description });
    setModalOpen(false);
  };

  const markPaid = (feeId: string) => {
    const fee = fees.find(f => f.id === feeId);
    if (fee) updateFee({ ...fee, status: "Paid", paidDate: new Date().toISOString().split("T")[0] });
  };

  return (
    <DashboardLayout>
      <PageHeader title="Fees Management" action={<PrimaryButton onClick={openAdd}><IconPlus className="w-4 h-4" /> Add Fee</PrimaryButton>} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Collected" value={`${(totalCollected / 1000).toFixed(0)}K`} color="success" />
        <StatCard label="Pending" value={`${(totalPending / 1000).toFixed(0)}K`} color="warning" />
        <StatCard label="Overdue" value={`${(totalOverdue / 1000).toFixed(0)}K`} color="destructive" />
      </div>

      <DataTable headers={["Student", "Description", "Amount", "Due Date", "Paid Date", "Status", "Action"]}>
        {fees.map(f => {
          const student = students.find(s => s.id === f.studentId);
          return (
            <tr key={f.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{student?.name || "Unknown"}</td>
              <td className="px-4 py-3 text-muted-foreground">{f.description}</td>
              <td className="px-4 py-3 text-foreground font-medium">{f.amount.toLocaleString()}</td>
              <td className="px-4 py-3 text-muted-foreground">{f.dueDate}</td>
              <td className="px-4 py-3 text-muted-foreground">{f.paidDate || "-"}</td>
              <td className="px-4 py-3"><Badge variant={f.status === "Paid" ? "success" : f.status === "Overdue" ? "destructive" : "warning"}>{f.status}</Badge></td>
              <td className="px-4 py-3">
                {f.status !== "Paid" && <button onClick={() => markPaid(f.id)} className="px-2 py-1 text-xs rounded-md bg-success/10 text-success hover:bg-success/20 font-medium">Mark Paid</button>}
              </td>
            </tr>
          );
        })}
      </DataTable>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Fee Record">
        <form onSubmit={e => { e.preventDefault(); handleAdd(); }}>
          <FormField label="Student"><FormSelect value={form.studentId} onChange={v => setForm(p => ({ ...p, studentId: v }))} options={students.map(s => ({ value: s.id, label: s.name }))} /></FormField>
          <FormField label="Amount"><FormInput value={form.amount} onChange={v => setForm(p => ({ ...p, amount: v }))} type="number" required /></FormField>
          <FormField label="Due Date"><FormInput value={form.dueDate} onChange={v => setForm(p => ({ ...p, dueDate: v }))} type="date" required /></FormField>
          <FormField label="Description"><FormInput value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} required placeholder="e.g. Term 2 Tuition Fee" /></FormField>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent">Cancel</button>
            <PrimaryButton type="submit">Add Fee</PrimaryButton>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
