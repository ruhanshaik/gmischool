import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { PageHeader, SearchInput, DataTable, PrimaryButton, Modal, FormField, FormInput, FormSelect, StatCard, Badge } from "@/components/ui-components";
import { IconPlus } from "@/components/icons";

export const Route = createFileRoute("/fees")({
  component: FeesPage,
});

function FeesPage() {
  const { fees, students, addFee, updateFee } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [collectModal, setCollectModal] = useState(false);
  const [searchSN, setSearchSN] = useState("");
  const [form, setForm] = useState({ studentId: "", amount: "", dueDate: "", description: "" });
  const [collectForm, setCollectForm] = useState({ studentId: "", collectAmount: "" });
  const [searchResult, setSearchResult] = useState<null | { student: typeof students[0]; totalFees: number; totalPaid: number; balance: number; records: typeof fees }>(null);

  const totalCollected = fees.filter(f => f.status === "Paid").reduce((s, f) => s + f.paidAmount, 0) + fees.filter(f => f.status !== "Paid").reduce((s, f) => s + f.paidAmount, 0);
  const totalPending = fees.reduce((s, f) => s + (f.amount - f.paidAmount), 0);
  const totalOverdue = fees.filter(f => f.status === "Overdue").reduce((s, f) => s + (f.amount - f.paidAmount), 0);

  const openAdd = () => { setForm({ studentId: students[0]?.id || "", amount: "", dueDate: "", description: "" }); setModalOpen(true); };

  const handleAdd = () => {
    addFee({ studentId: form.studentId, amount: Number(form.amount), dueDate: form.dueDate, paidDate: null, status: "Pending", description: form.description, paidAmount: 0 });
    setModalOpen(false);
  };

  const markPaid = (feeId: string) => {
    const fee = fees.find(f => f.id === feeId);
    if (fee) updateFee({ ...fee, status: "Paid", paidDate: new Date().toISOString().split("T")[0], paidAmount: fee.amount });
  };

  // Search student by student number
  const handleSearch = () => {
    const student = students.find(s => s.rollNumber.toLowerCase() === searchSN.toLowerCase());
    if (student) {
      const studentFees = fees.filter(f => f.studentId === student.id);
      const totalFees = studentFees.reduce((s, f) => s + f.amount, 0);
      const totalPaid = studentFees.reduce((s, f) => s + f.paidAmount, 0);
      setSearchResult({ student, totalFees, totalPaid, balance: totalFees - totalPaid, records: studentFees });
    } else {
      setSearchResult(null);
    }
  };

  // Collect fees
  const openCollect = (studentId: string) => {
    setCollectForm({ studentId, collectAmount: "" });
    setCollectModal(true);
  };

  const handleCollect = () => {
    const student = students.find(s => s.id === collectForm.studentId);
    if (!student) return;
    let remaining = Number(collectForm.collectAmount);
    const studentFees = fees.filter(f => f.studentId === collectForm.studentId && f.paidAmount < f.amount);
    for (const fee of studentFees) {
      if (remaining <= 0) break;
      const due = fee.amount - fee.paidAmount;
      const paying = Math.min(remaining, due);
      const newPaid = fee.paidAmount + paying;
      updateFee({ ...fee, paidAmount: newPaid, status: newPaid >= fee.amount ? "Paid" : "Pending", paidDate: newPaid >= fee.amount ? new Date().toISOString().split("T")[0] : fee.paidDate });
      remaining -= paying;
    }
    setCollectModal(false);
    // Refresh search
    if (searchResult) {
      setTimeout(() => handleSearch(), 100);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Fees Management" action={<PrimaryButton onClick={openAdd}><IconPlus className="w-4 h-4" /> Add Fee</PrimaryButton>} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Collected" value={`${(totalCollected / 1000).toFixed(0)}K`} color="success" />
        <StatCard label="Pending" value={`${(totalPending / 1000).toFixed(0)}K`} color="warning" />
        <StatCard label="Overdue" value={`${(totalOverdue / 1000).toFixed(0)}K`} color="destructive" />
      </div>

      {/* Search by student number */}
      <div className="bg-card rounded-xl border border-border p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Search Student Fees</h3>
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <input type="text" value={searchSN} onChange={e => setSearchSN(e.target.value)} placeholder="Enter Student Number (e.g. 2NDAAV001)" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <PrimaryButton onClick={handleSearch}>Search</PrimaryButton>
        </div>
        {searchResult && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Student</p>
                <p className="text-sm font-semibold text-foreground">{searchResult.student.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{searchResult.student.rollNumber}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total Fees</p>
                <p className="text-sm font-semibold text-foreground">{searchResult.totalFees.toLocaleString()}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Paid</p>
                <p className="text-sm font-semibold text-success">{searchResult.totalPaid.toLocaleString()}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="text-sm font-semibold text-destructive">{searchResult.balance.toLocaleString()}</p>
              </div>
            </div>
            {searchResult.balance > 0 && (
              <PrimaryButton onClick={() => openCollect(searchResult.student.id)}>Collect Fees</PrimaryButton>
            )}
            <DataTable headers={["Description", "Amount", "Paid", "Balance", "Status"]}>
              {searchResult.records.map(f => (
                <tr key={f.id}>
                  <td className="px-4 py-2 text-foreground">{f.description}</td>
                  <td className="px-4 py-2 text-muted-foreground">{f.amount.toLocaleString()}</td>
                  <td className="px-4 py-2 text-success">{f.paidAmount.toLocaleString()}</td>
                  <td className="px-4 py-2 text-destructive">{(f.amount - f.paidAmount).toLocaleString()}</td>
                  <td className="px-4 py-2"><Badge variant={f.status === "Paid" ? "success" : f.status === "Overdue" ? "destructive" : "warning"}>{f.status}</Badge></td>
                </tr>
              ))}
            </DataTable>
          </div>
        )}
      </div>

      <DataTable headers={["Student", "Student No", "Description", "Amount", "Paid", "Balance", "Status", "Action"]}>
        {fees.map(f => {
          const student = students.find(s => s.id === f.studentId);
          return (
            <tr key={f.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{student?.name || "Unknown"}</td>
              <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{student?.rollNumber || "-"}</td>
              <td className="px-4 py-3 text-muted-foreground">{f.description}</td>
              <td className="px-4 py-3 text-foreground font-medium">{f.amount.toLocaleString()}</td>
              <td className="px-4 py-3 text-success">{f.paidAmount.toLocaleString()}</td>
              <td className="px-4 py-3 text-destructive">{(f.amount - f.paidAmount).toLocaleString()}</td>
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
          <FormField label="Student"><FormSelect value={form.studentId} onChange={v => setForm(p => ({ ...p, studentId: v }))} options={students.map(s => ({ value: s.id, label: `${s.name} (${s.rollNumber})` }))} /></FormField>
          <FormField label="Amount"><FormInput value={form.amount} onChange={v => setForm(p => ({ ...p, amount: v }))} type="number" required /></FormField>
          <FormField label="Due Date"><FormInput value={form.dueDate} onChange={v => setForm(p => ({ ...p, dueDate: v }))} type="date" required /></FormField>
          <FormField label="Description"><FormInput value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} required placeholder="e.g. Term 2 Tuition Fee" /></FormField>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent">Cancel</button>
            <PrimaryButton type="submit">Add Fee</PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal open={collectModal} onClose={() => setCollectModal(false)} title="Collect Fees">
        <form onSubmit={e => { e.preventDefault(); handleCollect(); }}>
          <FormField label="Amount to Collect"><FormInput value={collectForm.collectAmount} onChange={v => setCollectForm(p => ({ ...p, collectAmount: v }))} type="number" required placeholder="Enter amount" /></FormField>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setCollectModal(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent">Cancel</button>
            <PrimaryButton type="submit">Collect</PrimaryButton>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
