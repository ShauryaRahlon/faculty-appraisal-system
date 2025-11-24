"use client";

import { useEffect } from "react";
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
import {
	getTotalScore,
	getCompletedSectionsCount,
} from "@/lib/localStorage";
import { APPRAISAL_SECTIONS } from "@/lib/constants";
import { Award, BookOpen, Calendar, TrendingUp, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const totalScore = getTotalScore();
	const completedSections = getCompletedSectionsCount();
	const totalSections = APPRAISAL_SECTIONS.length;
	const progressPercentage = (completedSections / totalSections) * 100;

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
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

	return (
		<div className="min-h-screen bg-muted/30">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				{/* Header with Logout Button */}
				<div className="flex justify-between items-start mb-8">
					<div>
						<h1 className="text-3xl font-bold text-foreground mb-2">
							Welcome back, {session.user?.name?.split(" ")[1] || session.user?.name || "Faculty Member"}!
						</h1>
						<p className="text-muted-foreground">
							Track and complete your annual performance appraisal
						</p>
					</div>
					<Button 
						variant="outline" 
						onClick={handleLogout}
						className="gap-2"
					>
						<LogOut className="h-4 w-4" />
						Logout
					</Button>
				</div>

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
					<Card className="border-primary/50">
						<CardHeader>
							<CardTitle>Continue Appraisal</CardTitle>
							<CardDescription>
								Resume filling out your appraisal sections
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Link href="/appraisal/general-details">
								<Button className="w-full">Go to Appraisal Sections</Button>
							</Link>
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
