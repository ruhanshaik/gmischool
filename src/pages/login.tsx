import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email === "Admin@gmail.com" && password === "GMI@0312") {
      localStorage.setItem("sms_auth", JSON.stringify({ email, role: "admin", name: "Admin User" }));
      navigate("/");
    } else if (email === "Teacher@gmail.com" && password === "GMI@0312") {
      localStorage.setItem("sms_auth", JSON.stringify({ email, role: "teacher", name: "Mr. Harrison" }));
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-foreground">St. Jude's Academy</h1>
            <p className="text-sm text-muted-foreground mt-1">School Management System</p>
          </div>
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive font-medium">{error}</div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Sign In</button>
          </form>
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-2">Login Credentials</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Admin: Admin@gmail.com / GMI@0312</p>
              <p>Teacher: Teacher@gmail.com / GMI@0312</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
