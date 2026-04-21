import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { PageHeader, PrimaryButton, FormField, FormInput } from "@/components/ui-components";

export default function SettingsPage() {
  const { user } = useApp();
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: "9876000000", address: "St. Jude's Academy, Mumbai" });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handlePwSave = (e: React.FormEvent) => { e.preventDefault(); if (pwForm.newPw === pwForm.confirm) { setPwSaved(true); setPwForm({ current: "", newPw: "", confirm: "" }); setTimeout(() => setPwSaved(false), 2000); } };

  return (
    <DashboardLayout>
      <PageHeader title="Settings" />

      <div className="max-w-2xl space-y-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Profile Information</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">{user.name.charAt(0)}</div>
            <div>
              <p className="font-semibold text-foreground">{form.name}</p>
              <p className="text-sm text-muted-foreground">{form.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <FormField label="Full Name"><FormInput value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} /></FormField>
              <FormField label="Email"><FormInput value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} type="email" /></FormField>
              <FormField label="Phone"><FormInput value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} /></FormField>
              <FormField label="Address"><FormInput value={form.address} onChange={v => setForm(p => ({ ...p, address: v }))} /></FormField>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <PrimaryButton type="submit">Save Changes</PrimaryButton>
              {saved && <span className="text-sm text-success font-medium">Profile updated successfully</span>}
            </div>
          </form>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Change Password</h3>
          <form onSubmit={handlePwSave}>
            <FormField label="Current Password"><FormInput value={pwForm.current} onChange={v => setPwForm(p => ({ ...p, current: v }))} type="password" /></FormField>
            <FormField label="New Password"><FormInput value={pwForm.newPw} onChange={v => setPwForm(p => ({ ...p, newPw: v }))} type="password" /></FormField>
            <FormField label="Confirm Password"><FormInput value={pwForm.confirm} onChange={v => setPwForm(p => ({ ...p, confirm: v }))} type="password" /></FormField>
            <div className="flex items-center gap-3 mt-4">
              <PrimaryButton type="submit">Update Password</PrimaryButton>
              {pwSaved && <span className="text-sm text-success font-medium">Password updated successfully</span>}
            </div>
          </form>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">School Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">School Name</span>
              <span className="font-medium text-foreground">St. Jude's Academy</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Established</span>
              <span className="font-medium text-foreground">1998</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Board</span>
              <span className="font-medium text-foreground">CBSE</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Principal</span>
              <span className="font-medium text-foreground">Dr. Margaret Thomas</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Address</span>
              <span className="font-medium text-foreground">24 Education Lane, Mumbai 400001</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
