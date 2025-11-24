// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import { setAuth, setUser } from "@/lib/localStorage";
// import { toast } from "sonner";
// import Image from "next/image";

// export default function Login() {
// 	const router = useRouter();
// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");
// 	const [isLoading, setIsLoading] = useState(false);

// 	const handleLogin = (e: React.FormEvent) => {
// 		e.preventDefault();
// 		setIsLoading(true);

// 		// Mock authentication
// 		setTimeout(() => {
// 			if (email && password) {
// 				setAuth(true);
// 				setUser({
// 					name: "Dr. Shikha K Mehta",
// 					email: email,
// 					department: "Computer Science & Engineering",
// 				});
// 				toast.success("Login successful!");
// 				router.push("/dashboard");
// 			} else {
// 				toast.error("Please enter email and password");
// 			}
// 			setIsLoading(false);
// 		}, 800);
// 	};

// 	return (
// 		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
// 			<Card className="w-full max-w-md shadow-xl">
// 				<CardHeader className="space-y-3 text-center">
// 					<div className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl">
// 						<Image src="/logo.png" alt="JIIT Logo" width={128} height={128} />
// 					</div>
// 					<CardTitle className="text-2xl pt-5">
// 						Faculty Appraisal Portal
// 					</CardTitle>
// 					<CardDescription>
// 						Sign in to submit your annual performance appraisal
// 					</CardDescription>
// 				</CardHeader>
// 				<CardContent>
// 					<form onSubmit={handleLogin} className="space-y-4">
// 						<div className="space-y-2">
// 							<Label htmlFor="email">Email Address</Label>
// 							<Input
// 								id="email"
// 								type="email"
// 								placeholder="faculty@jiit.ac.in"
// 								value={email}
// 								onChange={(e) => setEmail(e.target.value)}
// 								required
// 							/>
// 						</div>
// 						<div className="space-y-2">
// 							<Label htmlFor="password">Password</Label>
// 							<Input
// 								id="password"
// 								type="password"
// 								placeholder="••••••••"
// 								value={password}
// 								onChange={(e) => setPassword(e.target.value)}
// 								required
// 							/>
// 						</div>
// 						<Button type="submit" className="w-full" disabled={isLoading}>
// 							{isLoading ? "Signing in..." : "Sign In"}
// 						</Button>
// 					</form>
// 					<div className="mt-6 text-center text-sm text-muted-foreground">
// 						<p>Demo credentials: Any email and password</p>
// 					</div>
// 				</CardContent>
// 			</Card>
// 		</div>
// 	);
// }


//hiding this auth to check if nodemailer works will change this later


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  
  // 'identifier' can be either Email (shikha.mehta@jiit.ac.in) or Code (JIIT1137)
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Step 1: Call our custom login API to check credentials and handle OTP if needed
      const loginRes = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        // Login failed (wrong credentials, user not found, etc.)
        toast.error(loginData.error || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      // Step 2: Check if OTP is required (first-time login)
      if (loginData.requiresOtp) {
        toast.info("First login detected. An OTP has been sent to your registered email.");
        router.push(`/verify-otp?identifier=${encodeURIComponent(identifier)}`);
        setIsLoading(false);
        return;
      }

      // Step 3: User is verified, proceed with NextAuth sign in
      if (loginData.verified) {
        const res = await signIn("credentials", {
          identifier,
          password,
          redirect: false,
        });

        if (res?.error) {
          toast.error("Authentication failed. Please try again.");
        } else {
          toast.success("Login successful!");
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-sm p-2">
            {/* Make sure logo.png exists in your /public folder */}
            <Image 
              src="/logo.png" 
              alt="JIIT Logo" 
              width={96} 
              height={96} 
              className="object-contain"
              priority
            />
          </div>
          <CardTitle className="text-2xl pt-2 font-bold text-primary">
            Faculty Appraisal Portal
          </CardTitle>
          <CardDescription>
            Sign in to submit your Annual Performance Appraisal Report (APAR)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Employee Code or Email Address</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="e.g., JIIT1137 or faculty@jiit.ac.in"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="h-11"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* Optional: Add Forgot Password link here later */}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium transition-all" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
            <p><strong>First time logging in?</strong></p>
            <p>Use your Employee Code and the default password provided by administration. You will be asked to verify via email OTP.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}