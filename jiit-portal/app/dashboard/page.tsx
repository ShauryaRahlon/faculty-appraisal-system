"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	getTotalScore,
	getCompletedSectionsCount,
	hydrateFromServer,
} from "@/lib/localStorage";
import { getAppraisalStatus, submitAppraisal } from "@/lib/api";
import { APPRAISAL_SECTIONS } from "@/lib/constants";
import { Award, BookOpen, Calendar, TrendingUp, Loader2, LogOut, Info, AlertTriangle, CheckCircle, KeyRound, X } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Dashboard() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [totalScore, setTotalScore] = useState(getTotalScore());
	const [completedSections, setCompletedSections] = useState(getCompletedSectionsCount());
	const [adminStatus, setAdminStatus] = useState<{admin_status: string, verified_score: number, admin_remarks: string} | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const totalSections = APPRAISAL_SECTIONS.length;
	const progressPercentage = (completedSections / totalSections) * 100;

	// Change Password state
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
			return;
		}

		// Hydrate from server if localStorage is empty (new browser/incognito)
		if (status === "authenticated") {
			hydrateFromServer().then(() => {
				setTotalScore(getTotalScore());
				setCompletedSections(getCompletedSectionsCount());
			});
			getAppraisalStatus().then((res: any) => {
				if (res) {
					setAdminStatus(res);
				}
			});
		}
	}, [status, router]);

	// Show loading state while checking authentication
	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	// If not authenticated, don't render anything (redirect will happen)
	if (!session) {
		return null;
	}

	const handleLogout = async () => {
		await signOut({ redirect: false });
		toast.success("Logged out successfully");
		router.push("/login");
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmNewPassword) {
			toast.error("New passwords do not match");
			return;
		}
		if (newPassword.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		setIsChangingPassword(true);
		try {
			const res = await fetch("/api/faculty/change-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ currentPassword, newPassword }),
			});
			const data = await res.json();
			if (res.ok) {
				toast.success("Password changed successfully!");
				setShowChangePassword(false);
				setCurrentPassword("");
				setNewPassword("");
				setConfirmNewPassword("");
			} else {
				toast.error(data.error || "Failed to change password");
			}
		} catch {
			toast.error("Network error occurred");
		} finally {
			setIsChangingPassword(false);
		}
	};

	const handleFinalSubmit = async () => {
		if (progressPercentage < 100) return;
		setIsSubmitting(true);
		try {
			await submitAppraisal();
			setAdminStatus({ admin_status: "Pending Review", verified_score: 0, admin_remarks: "" });
			toast.success("Appraisal submitted successfully for review!");
		} catch (error) {
			toast.error("Failed to submit appraisal. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-muted/30">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				{/* Header with Logout Button */}
				<div className="flex justify-between items-start mb-8">
					<div>
						<h1 className="text-3xl font-bold text-foreground mb-2">
							Welcome back, {session.user?.name || session.user?.name || "Faculty Member"}!
						</h1>
						<p className="text-muted-foreground">
							Track and complete your annual performance appraisal
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Button 
							variant="outline" 
							onClick={() => setShowChangePassword(true)}
							className="gap-2"
						>
							<KeyRound className="h-4 w-4" />
							Change Password
						</Button>
						<Button 
							variant="outline" 
							onClick={handleLogout}
							className="gap-2"
						>
							<LogOut className="h-4 w-4" />
							Logout
						</Button>
					</div>
				</div>

				{/* Change Password Modal */}
				{showChangePassword && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
						<Card className="w-full max-w-md shadow-2xl">
							<CardHeader className="relative">
								<Button
									variant="ghost"
									size="sm"
									className="absolute right-4 top-4"
									onClick={() => {
										setShowChangePassword(false);
										setCurrentPassword("");
										setNewPassword("");
										setConfirmNewPassword("");
									}}
								>
									<X className="h-4 w-4" />
								</Button>
								<CardTitle className="flex items-center gap-2">
									<KeyRound className="h-5 w-5 text-primary" />
									Change Password
								</CardTitle>
								<CardDescription>
									Enter your current password and choose a new one
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleChangePassword} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="current-password">Current Password</Label>
										<Input
											id="current-password"
											type="password"
											placeholder="Enter current password"
											value={currentPassword}
											onChange={(e) => setCurrentPassword(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="new-password">New Password</Label>
										<Input
											id="new-password"
											type="password"
											placeholder="At least 6 characters"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="confirm-new-password">Confirm New Password</Label>
										<Input
											id="confirm-new-password"
											type="password"
											placeholder="Re-enter new password"
											value={confirmNewPassword}
											onChange={(e) => setConfirmNewPassword(e.target.value)}
											required
										/>
									</div>
									<div className="flex gap-3 pt-2">
										<Button
											type="button"
											variant="outline"
											className="flex-1"
											onClick={() => {
												setShowChangePassword(false);
												setCurrentPassword("");
												setNewPassword("");
												setConfirmNewPassword("");
											}}
										>
											Cancel
										</Button>
										<Button type="submit" className="flex-1" disabled={isChangingPassword}>
											{isChangingPassword ? (
												<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
											) : "Update Password"}
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Admin Review Status Alert */}
				{adminStatus && (
					<div className="mb-8">
						{adminStatus.admin_status === "Pending Review" && (
							<Alert>
								<Info className="h-4 w-4" />
								<AlertTitle>Under Review</AlertTitle>
								<AlertDescription>
									Your appraisal has been submitted and is currently waiting for HOD/Admin review.
								</AlertDescription>
							</Alert>
						)}
						{adminStatus.admin_status === "Returned" && (
							<Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
								<AlertTriangle className="h-4 w-4" color="#b91c1c" />
								<AlertTitle className="text-red-900">Returned for Revision</AlertTitle>
								<AlertDescription>
									<p className="mb-2">Your appraisal was sent back by the HOD/Admin.</p>
									{adminStatus.admin_remarks && (
										<div className="bg-white/50 p-3 rounded-md text-sm italic border border-red-100">
											&quot;{adminStatus.admin_remarks}&quot;
										</div>
									)}
								</AlertDescription>
							</Alert>
						)}
						{adminStatus.admin_status === "Reviewed" && (
							<Alert className="bg-green-50 border-green-200 text-green-900">
								<CheckCircle className="h-4 w-4" color="#15803d" />
								<AlertTitle className="text-green-900">Approved</AlertTitle>
								<AlertDescription>
									<p className="mb-2">Your appraisal has been successfully reviewed and approved.</p>
									{adminStatus.verified_score > 0 && (
										<p className="font-medium mb-2">Verified Score: {adminStatus.verified_score}</p>
									)}
									{adminStatus.admin_remarks && (
										<div className="bg-white/50 p-3 rounded-md text-sm italic border border-green-100">
											&quot;{adminStatus.admin_remarks}&quot;
										</div>
									)}
								</AlertDescription>
							</Alert>
						)}
					</div>
				)}

				{/* Stats Grid */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total API Score
							</CardTitle>
							<Award className="h-4 w-4 text-primary" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-primary">
								{totalScore}
							</div>
							<p className="text-xs text-muted-foreground">
								Points accumulated
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Sections Completed
							</CardTitle>
							<BookOpen className="h-4 w-4 text-success" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-success">
								{completedSections}/{totalSections}
							</div>
							<p className="text-xs text-muted-foreground">
								{totalSections - completedSections} remaining
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Progress</CardTitle>
							<TrendingUp className="h-4 w-4 text-warning" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-warning">
								{progressPercentage.toFixed(0)}%
							</div>
							<p className="text-xs text-muted-foreground">
								Overall completion
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Academic Year
							</CardTitle>
							<Calendar className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">2024-25</div>
							<p className="text-xs text-muted-foreground">Current period</p>
						</CardContent>
					</Card>
				</div>

				{/* Progress Card */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Appraisal Progress</CardTitle>
						<CardDescription>
							Complete all sections to submit your final appraisal
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Progress value={progressPercentage} className="h-3 mb-2" />
						<p className="text-sm text-muted-foreground">
							{completedSections} of {totalSections} sections completed
						</p>
					</CardContent>
				</Card>

				{/* Action Cards */}
				<div className="grid gap-6 md:grid-cols-2">
					<Card className="border-primary/50 flex flex-col justify-between">
						<CardHeader>
							<CardTitle>
								{adminStatus?.admin_status === "Pending Review" || adminStatus?.admin_status === "Reviewed"
									? "View Appraisal"
									: "Continue Appraisal"}
							</CardTitle>
							<CardDescription>
								{adminStatus?.admin_status === "Pending Review" || adminStatus?.admin_status === "Reviewed"
									? "Review your submitted appraisal sections (Read-Only)"
									: "Resume filling out your appraisal sections"}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Link href="/appraisal/general-details" className="block w-full">
								<Button className="w-full" variant="outline">
									{adminStatus?.admin_status === "Pending Review" || adminStatus?.admin_status === "Reviewed"
										? "View Submitted Sections"
										: "Go to Appraisal Sections"}
								</Button>
							</Link>
							
							{/* Final Submit Logic */}
							{(adminStatus?.admin_status === "Draft" || adminStatus?.admin_status === "Returned") && (
								<div className="pt-4 border-t">
									<Button 
										className="w-full" 
										disabled={progressPercentage < 100 || isSubmitting}
										onClick={handleFinalSubmit}
									>
										{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
										{progressPercentage < 100 ? "Complete All Sections to Submit" : "Final Submit for Review"}
									</Button>
								</div>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Important Guidelines</CardTitle>
							<CardDescription>
								Review the appraisal submission requirements
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2 text-sm text-muted-foreground">
							<p>• Complete all 12 sections before final submission</p>
							<p>• Provide accurate and verifiable information</p>
							<p>• Upload supporting documents where required</p>
							<p>• Review your entries before submitting each section</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
