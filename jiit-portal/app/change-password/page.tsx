"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function ChangePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  

  const identifier = searchParams.get("identifier");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (!identifier) return toast.error("Missing User Identifier");
    
    setLoading(true);

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        // CHANGED: Send 'identifier'
        body: JSON.stringify({ identifier, newPassword: password }),
      });

      if (res.ok) {
        toast.success("Password updated! Please login with your new password.");
        router.push("/login");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update password");
      }
    } catch {
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle>Set New Password</CardTitle>
        <CardDescription>Create a secure password for <strong>{identifier}</strong></CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
               <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
            ) : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ChangePassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ChangePasswordContent />
      </Suspense>
    </div>
  );
}