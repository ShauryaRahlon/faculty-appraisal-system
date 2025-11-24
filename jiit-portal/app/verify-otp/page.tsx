"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // CHANGED: We now look for 'identifier' (which matches what Login sends)
  const identifier = searchParams.get("identifier");
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return toast.error("Missing User Identifier");
    setLoading(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        body: JSON.stringify({ identifier, otp }), // Send identifier
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP Verified Successfully! You can now change your password.");
        // Pass identifier to the change password page
        router.push(`/change-password?identifier=${encodeURIComponent(identifier)}`);
      } else {
        toast.error(data.error || "Verification failed");
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
        <CardTitle>Verify OTP</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to your registered email for <strong>{identifier}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label>One Time Password</Label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="text-center text-lg tracking-[0.5em] font-mono h-12"
              required
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
               <>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
               </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function VerifyOtp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOtpContent />
      </Suspense>
    </div>
  );
}