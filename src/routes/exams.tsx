import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { PageHeader, DataTable, PrimaryButton, Modal, FormField, FormInput, FormSelect, Badge } from "@/components/ui-components";
import { IconPlus } from "@/components/icons";

export const Route = createFileRoute("/exams")({
  component: ExamsPage,
});

function ExamsPage() {
  const { exams, classes, students, results, addExam, addResult, updateResult, role } = useApp();
  const [examModal, setExamModal] = useState(false);
  const [marksModal, setMarksModal] = useState(false);
  const [resultView, setResultView] = useState<string | null>(null);
  const [examForm, setExamForm] = useState({ name: "", classId: "", subject: "", date: "", totalMarks: "100" });

  // Marks flow: select exam -> class -> students
  const [selectedExamForMarks, setSelectedExamForMarks] = useState("");
  const [selectedClassForMarks, setSelectedClassForMarks] = useState("");

  const openAddExam = () => {
    setExamForm({ name: "", classId: classes[0]?.id || "", subject: "", date: "", totalMarks: "100" });
    setExamModal(true);
  };

  const handleAddExam = () => {
    addExam({ ...examForm, totalMarks: Number(examForm.totalMarks) });
    setExamModal(false);
  };

  const openMarksModal = () => {
    setSelectedExamForMarks("");
    setSelectedClassForMarks("");
    setMarksModal(true);
  };

  // Get unique exam names
  const uniqueExamNames = [...new Set(exams.map(e => e.name))];
  // Get classes for selected exam
  const classesForExam = exams.filter(e => e.name === selectedExamForMarks).map(e => e.classId);
  const classOptionsForMarks = classes.filter(c => classesForExam.includes(c.id));
  // Get the specific exam for selected exam name + class
  const selectedExam = exams.find(e => e.name === selectedExamForMarks && e.classId === selectedClassForMarks);
  const examStudentsForMarks = selectedExam ? students.filter(s => s.classId === selectedExam.classId) : [];

  const resultExam = resultView ? exams.find(e => e.id === resultView) : null;
  const resultStudents = resultExam ? students.filter(s => s.classId === resultExam.classId) : [];

  return (
    <DashboardLayout>
      <PageHeader title="Exams & Results" action={
        <div className="flex gap-2">
          {role === "admin" && <PrimaryButton onClick={openAddExam}><IconPlus className="w-4 h-4" /> Create Exam</PrimaryButton>}
          <PrimaryButton onClick={openMarksModal}><IconPlus className="w-4 h-4" /> Add Marks</PrimaryButton>
        </div>
      } />

      <DataTable headers={["Exam Name", "Class", "Subject", "Date", "Total Marks", "Actions"]}>
        {exams.map(e => {
          const cls = classes.find(c => c.id === e.classId);
          return (
            <tr key={e.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{e.name}</td>
              <td className="px-4 py-3"><Badge>{cls ? `${cls.name}-${cls.section}` : ""}</Badge></td>
              <td className="px-4 py-3 text-muted-foreground">{e.subject}</td>
              <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
              <td className="px-4 py-3 text-muted-foreground">{e.totalMarks}</td>
              <td className="px-4 py-3">
                <button onClick={() => setResultView(e.id)} className="px-2 py-1 text-xs rounded-md bg-success/10 text-success hover:bg-success/20">View Results</button>
              </td>
            </tr>
          );
        })}
      </DataTable>

      {/* Create Exam */}
      <Modal open={examModal} onClose={() => setExamModal(false)} title="Create Exam">
        <form onSubmit={e => { e.preventDefault(); handleAddExam(); }}>
          <FormField label="Exam Name"><FormInput value={examForm.name} onChange={v => setExamForm(p => ({ ...p, name: v }))} required placeholder="e.g. Mid-Term Examination" /></FormField>
          <FormField label="Class"><FormSelect value={examForm.classId} onChange={v => setExamForm(p => ({ ...p, classId: v }))} options={classes.map(c => ({ value: c.id, label: `${c.name} - ${c.section}` }))} /></FormField>
          <FormField label="Subject"><FormInput value={examForm.subject} onChange={v => setExamForm(p => ({ ...p, subject: v }))} required /></FormField>
          <FormField label="Date"><FormInput value={examForm.date} onChange={v => setExamForm(p => ({ ...p, date: v }))} type="date" required /></FormField>
          <FormField label="Total Marks"><FormInput value={examForm.totalMarks} onChange={v => setExamForm(p => ({ ...p, totalMarks: v }))} type="number" /></FormField>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setExamModal(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent">Cancel</button>
            <PrimaryButton type="submit">Create Exam</PrimaryButton>
          </div>
        </form>
      </Modal>

      {/* Add Marks - Step by step: Exam -> Class -> Students */}
      <Modal open={marksModal} onClose={() => setMarksModal(false)} title="Add Marks" maxWidth="max-w-xl">
        <div className="space-y-4">
          <FormField label="Select Exam">
            <FormSelect value={selectedExamForMarks} onChange={v => { setSelectedExamForMarks(v); setSelectedClassForMarks(""); }} options={[{ value: "", label: "-- Select Exam --" }, ...uniqueExamNames.map(n => ({ value: n, label: n }))]} />
          </FormField>
          {selectedExamForMarks && (
            <FormField label="Select Class">
              <FormSelect value={selectedClassForMarks} onChange={setSelectedClassForMarks} options={[{ value: "", label: "-- Select Class --" }, ...classOptionsForMarks.map(c => ({ value: c.id, label: `${c.name} - ${c.section}` }))]} />
            </FormField>
          )}
          {selectedExam && examStudentsForMarks.length > 0 && (
            <MarksEntry exam={selectedExam} students={examStudentsForMarks} results={results} addResult={addResult} updateResult={updateResult} onClose={() => setMarksModal(false)} />
          )}
        </div>
      </Modal>

      {/* View Results */}
      <Modal open={!!resultView} onClose={() => setResultView(null)} title={`Results - ${resultExam?.name || ""}`} maxWidth="max-w-xl">
        {resultExam && (
          <DataTable headers={["Student", "Marks", "Percentage", "Grade"]}>
            {resultStudents.map(s => {
              const r = results.find(x => x.examId === resultExam.id && x.studentId === s.id);
              if (!r) return null;
              const pct = Math.round((r.marksObtained / resultExam.totalMarks) * 100);
              const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "F";
              return (
                <tr key={s.id}>
                  <td className="px-4 py-2 text-foreground">{s.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.marksObtained}/{resultExam.totalMarks}</td>
                  <td className="px-4 py-2 text-muted-foreground">{pct}%</td>
                  <td className="px-4 py-2"><Badge variant={pct >= 60 ? "success" : pct >= 40 ? "warning" : "destructive"}>{grade}</Badge></td>
                </tr>
              );
            })}
          </DataTable>
        )}
      </Modal>
    </DashboardLayout>
  );
}

function MarksEntry({ exam, students: examStudents, results, addResult, updateResult, onClose }: any) {
  const [marks, setMarks] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    examStudents.forEach((s: any) => {
      const r = results.find((x: any) => x.examId === exam.id && x.studentId === s.id);
      m[s.id] = r ? String(r.marksObtained) : "";
    });
    return m;
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    Object.entries(marks).forEach(([studentId, val]) => {
      if (!val) return;
      const existing = results.find((r: any) => r.examId === exam.id && r.studentId === studentId);
      if (existing) updateResult({ ...existing, marksObtained: Number(val) });
      else addResult({ examId: exam.id, studentId, marksObtained: Number(val) });
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1000);
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-3">{exam.subject} - Total: {exam.totalMarks}</p>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {examStudents.map((s: any) => (
          <div key={s.id} className="flex items-center justify-between gap-3">
            <span className="text-sm text-foreground flex-1">{s.name}</span>
            <input type="number" value={marks[s.id] || ""} onChange={e => setMarks(p => ({ ...p, [s.id]: e.target.value }))} max={exam.totalMarks} min={0} placeholder={`/ ${exam.totalMarks}`} className="w-24 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-4">
        <PrimaryButton onClick={handleSave}>Save Marks</PrimaryButton>
        {saved && <span className="text-sm text-success">Saved</span>}
      </div>
    </div>
  );
}
