"use client";

import { useState, useMemo, useEffect } from "react";
import {
	Search,
	Download,
	FileText,
	CheckCircle2,
	XCircle,
	ChevronLeft,
	Users,
	Clock,
	BarChart3,
	FileCheck,
	KeyRound,
	X,
	UserPlus,
	UserMinus,
	Loader2,
	Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { signOut } from "next-auth/react";
import { getAllFacultyData, updateAppraisalStatus } from "@/lib/api";
import { toast } from "sonner";

// --- TYPES ---
interface Faculty {
	id: string;
	name: string;
	designation: string;
	department: string;
	joiningDate: string;
	score: number;
	status: string;
	date: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	rawData: Record<string, any>;
}

interface ManagedFaculty {
	id: string;
	employeeCode: string;
	name: string;
	email: string;
	department: string;
	designation: string;
	unit: string;
	isVerified: boolean;
	createdAt: string;
}

export default function HODDashboard() {
	// --- STATE MANAGEMENT ---
	const [facultyList, setFacultyList] = useState<Faculty[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
	const [reviewScore, setReviewScore] = useState(0);
	const [reviewRemark, setReviewRemark] = useState("");
	const [activeTab, setActiveTab] = useState<"Pending Review" | "Reviewed" | "Returned">("Pending Review");
	const [isUpdating, setIsUpdating] = useState(false);

	// Change Password state
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	// Faculty Management state
	const [showManageFaculty, setShowManageFaculty] = useState(false);
	const [managedFacultyList, setManagedFacultyList] = useState<ManagedFaculty[]>([]);
	const [isFetchingFaculty, setIsFetchingFaculty] = useState(false);
	const [manageFacultySearch, setManageFacultySearch] = useState("");
	// Onboard form state
	const [showOnboardForm, setShowOnboardForm] = useState(false);
	const [onboardData, setOnboardData] = useState({
		employeeCode: "",
		name: "",
		email: "",
		department: "COMPUTER SCIENCE/ INFO. TECH.",
		designation: "",
		unit: "JIIT Noida Sec-62",
	});
	const [isOnboarding, setIsOnboarding] = useState(false);
	// Remove confirmation
	const [removingCode, setRemovingCode] = useState<string | null>(null);
	const [isRemoving, setIsRemoving] = useState(false);

	// Fetch data on mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const response = (await getAllFacultyData()) as { result: any[] };
				if (response?.result) {
					// Start with empty list
					const processedList: Faculty[] = [];

					// Iterate over each user's data blob
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					response.result.forEach((userDoc: any) => {
						const userId = userDoc.user_id;
						// Extract basic info from "1-10" section if available
						const basicInfo = userDoc["1-10"]?.data || {};
						const name = basicInfo.full_name || userId || "Unknown User";
						const designation = basicInfo.present_designation || "N/A";
						const department = basicInfo.department || "N/A";
						const joiningDate = basicInfo.institute_joining_date || "N/A";

						// Calculate total score from all sections
						let totalScore = 0;
						
						// 1. Calculate from backend root keys if they exist (ignoring metadata keys)
						const backendKeysToIgnore = ["user_id", "hod_review", "frontend_progress", "1-10", "_id"];
						Object.keys(userDoc).forEach((key) => {
							if (!backendKeysToIgnore.includes(key) && userDoc[key]?.score !== undefined) {
								totalScore += Number(userDoc[key].score) || 0;
							}
						});

						// 2. Add any scores from frontend_progress that might not be in root keys yet
						// (Especially generalDetails which is 10 points and doesn't save to a root .score)
						if (userDoc.frontend_progress) {
							Object.keys(userDoc.frontend_progress).forEach((fpKey) => {
								if (fpKey !== "sectionStatus") {
									const fpSection = userDoc.frontend_progress[fpKey];
									if (fpSection && typeof fpSection === "object" && typeof fpSection.apiScore === "number") {
										// Avoid double counting if backend already processed it
										// Backend keys are usually numbers (11, 12.1), frontend keys are camelCase
										// But since 'generalDetails' doesn't have a backend score key, we definitely add it.
										// To be safe and show exactly what frontend shows, we can just use frontend_progress scores 
										// for sections that haven't been finalized in backend root.
										// Actually, if we just want to match the frontend view, sum all frontend apiScores!
									}
								}
							});
						}
						
						// Re-evaluate: To match what the user sees on their dashboard, we should just
						// calculate the score exactly like `getTotalScore` in `lib/localStorage.ts`
						let calculatedScore = 0;
						if (userDoc.frontend_progress) {
							Object.keys(userDoc.frontend_progress).forEach((key) => {
								if (key !== "sectionStatus") {
									const section = userDoc.frontend_progress[key];
									if (section && typeof section === "object" && "apiScore" in section) {
										calculatedScore += Number(section.apiScore) || 0;
									}
								}
							});
						} else {
							// Fallback to backend keys
							Object.keys(userDoc).forEach((key) => {
								if (!backendKeysToIgnore.includes(key) && userDoc[key]?.score !== undefined) {
									calculatedScore += Number(userDoc[key].score) || 0;
								}
							});
							if (userDoc["1-10"]) {
								calculatedScore += 10; // Default score for general details if present
							}
						}

						totalScore = calculatedScore;

						// Determine status based on some logic, defaulting to "Submitted" if data exists
						const status = userDoc.admin_status || "Pending Review";

						processedList.push({
							id: userId,
							name,
							designation,
							department,
							joiningDate,
							score: totalScore,
							status,
							date: new Date().toISOString().split("T")[0], // Mock date
							rawData: userDoc, // Store all data for detailed view
						});
					});
					setFacultyList(processedList);
				}
			} catch (error) {
				console.error("Failed to fetch faculty data", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	// --- COMPUTED VALUES ---
	// Filter out Draft users so HOD only sees submitted forms
	const validFacultyList = facultyList.filter(f => f.status !== "Draft");

	const filteredFaculty = validFacultyList.filter((f) => {
		const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesTab = f.status === activeTab;
		return matchesSearch && matchesTab;
	});

	const stats = useMemo(() => {
		const total = facultyList.length; // Total faculty in system
		const submitted = validFacultyList.length; // Faculty who have clicked "Final Submit"
		const pending = validFacultyList.filter(
			(f) => f.status === "Pending Review"
		).length;
		const totalScore = validFacultyList.reduce((acc, curr) => acc + curr.score, 0);
		const avg = submitted > 0 ? (totalScore / submitted).toFixed(1) : 0;
		return { total, submitted, pending, avg };
	}, [facultyList]);

	// --- ACTIONS ---
	const handleDownloadReport = () => {
		const headers = ["ID,Name,Designation,Department,Score,Status,Date\n"];
		const rows = facultyList.map(
			(f) =>
				`${f.id},"${f.name}","${f.designation}","${f.department}",${f.score},"${f.status}","${f.date}"`
		);
		const csvContent =
			"data:text/csv;charset=utf-8," + headers + rows.join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "faculty_appraisal_report.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleOpenReview = (faculty: Faculty) => {
		setSelectedFaculty(faculty);
		setReviewScore(faculty.score);
		setReviewRemark("");
	};

	const handleApprove = async () => {
		if (!selectedFaculty) return;
		setIsUpdating(true);
		try {
			await updateAppraisalStatus(selectedFaculty.id, "Reviewed", reviewScore, reviewRemark);
			const updatedList = facultyList.map((f) => {
				if (f.id === selectedFaculty.id)
					return { ...f, status: "Reviewed", score: reviewScore };
				return f;
			});
			setFacultyList(updatedList);
			setSelectedFaculty(null);
		} catch (error) {
			console.error("Failed to approve:", error);
			alert("Failed to update status. Please try again.");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleSendBack = async () => {
		if (!selectedFaculty) return;
		setIsUpdating(true);
		try {
			await updateAppraisalStatus(selectedFaculty.id, "Returned", reviewScore, reviewRemark);
			const updatedList = facultyList.map((f) => {
				if (f.id === selectedFaculty.id) return { ...f, status: "Returned" };
				return f;
			});
			setFacultyList(updatedList);
			setSelectedFaculty(null);
		} catch (error) {
			console.error("Failed to send back:", error);
			alert("Failed to update status. Please try again.");
		} finally {
			setIsUpdating(false);
		}
	};

	// --- CHANGE PASSWORD ---
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
			const res = await fetch("/api/admin/change-password", {
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

	// --- FACULTY MANAGEMENT ---
	const fetchManagedFacultyList = async () => {
		setIsFetchingFaculty(true);
		try {
			const res = await fetch("/api/admin/faculty/list");
			const data = await res.json();
			if (res.ok) {
				setManagedFacultyList(data.faculty);
			} else {
				toast.error(data.error || "Failed to fetch faculty list");
			}
		} catch {
			toast.error("Network error occurred");
		} finally {
			setIsFetchingFaculty(false);
		}
	};

	const handleOpenManageFaculty = () => {
		setShowManageFaculty(true);
		fetchManagedFacultyList();
	};

	const handleOnboardFaculty = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsOnboarding(true);
		try {
			const res = await fetch("/api/admin/faculty/onboard", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(onboardData),
			});
			const data = await res.json();
			if (res.ok) {
				toast.success(data.message);
				setShowOnboardForm(false);
				setOnboardData({
					employeeCode: "",
					name: "",
					email: "",
					department: "COMPUTER SCIENCE/ INFO. TECH.",
					designation: "",
					unit: "JIIT Noida Sec-62",
				});
				fetchManagedFacultyList();
			} else {
				toast.error(data.error || "Failed to onboard faculty");
			}
		} catch {
			toast.error("Network error occurred");
		} finally {
			setIsOnboarding(false);
		}
	};

	const handleRemoveFaculty = async (employeeCode: string) => {
		setIsRemoving(true);
		try {
			const res = await fetch("/api/admin/faculty/remove", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ employeeCode }),
			});
			const data = await res.json();
			if (res.ok) {
				toast.success(data.message);
				setRemovingCode(null);
				fetchManagedFacultyList();
			} else {
				toast.error(data.error || "Failed to remove faculty");
			}
		} catch {
			toast.error("Network error occurred");
		} finally {
			setIsRemoving(false);
		}
	};

	const filteredManagedFaculty = managedFacultyList.filter(
		(f) =>
			f.name.toLowerCase().includes(manageFacultySearch.toLowerCase()) ||
			f.employeeCode.toLowerCase().includes(manageFacultySearch.toLowerCase()) ||
			f.email.toLowerCase().includes(manageFacultySearch.toLowerCase())
	);


	const getStatusColor = (status: string) => {
		switch (status) {
			case "Reviewed":
				return "bg-green-100 text-green-700 border-green-200";
			case "Pending Review":
				return "bg-amber-100 text-amber-700 border-amber-200";
			case "Returned":
				return "bg-red-100 text-red-700 border-red-200";
			default:
				return "bg-slate-100 text-slate-700 border-slate-200";
		}
	};

	// Helper to extract images from raw data
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const getProofImages = (facultyData: any) => {
		const images: string[] = [];
		if (!facultyData) return images;

		// Traverse all sections
		Object.keys(facultyData).forEach((sectionKey) => {
			const section = facultyData[sectionKey];
			// Check for 'data' array in section
			if (section?.data && Array.isArray(section.data)) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				section.data.forEach((item: any) => {
					if (item.proof_files && Array.isArray(item.proof_files)) {
						item.proof_files.forEach((file: string) => {
							if (
								file &&
								typeof file === "string" &&
								file.startsWith("data:image")
							) {
								images.push(file);
							}
						});
					}
				});
			}
			// Check for specific api_score_list structures where proof_files might be nested differently?
			// The backend transformer ensures it's in the data item, so the above loop should catch it.
		});
		return images;
	};

	// --- VIEW 2: REVIEW MODE ---
	if (selectedFaculty) {
		const proofImages = getProofImages(selectedFaculty.rawData);

		return (
			<div className="min-h-screen bg-muted/30 p-4 md:p-8">
				<div className="max-w-6xl mx-auto">
					<Button
						variant="ghost"
						className="mb-6 pl-0 hover:pl-2 transition-all"
						onClick={() => setSelectedFaculty(null)}
					>
						<ChevronLeft className="h-4 w-4 mr-2" /> Back to Dashboard
					</Button>
					<div className="grid gap-6 md:grid-cols-3">
						<div className="md:col-span-2 space-y-6">
							<Card>
								<CardHeader>
									<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
										<div>
											<CardTitle className="text-xl md:text-2xl">
												{selectedFaculty.name}
											</CardTitle>
											<CardDescription>
												{selectedFaculty.designation}
											</CardDescription>
										</div>
										<Badge
											variant="outline"
											className={getStatusColor(selectedFaculty.status)}
										>
											{selectedFaculty.status}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="p-4 bg-white border rounded-md shadow-sm">
										<h3 className="font-semibold mb-2 flex items-center">
											<FileText className="h-4 w-4 mr-2 text-primary" /> General
											Information
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
											<div>
												<span className="block font-medium text-foreground">
													Department
												</span>{" "}
												{selectedFaculty.department}
											</div>
											<div>
												<span className="block font-medium text-foreground">
													Joining Date
												</span>{" "}
												{selectedFaculty.joiningDate}
											</div>
										</div>
									</div>

									{/* Proof Images Section */}
									{proofImages.length > 0 && (
										<div className="p-4 bg-white border rounded-md shadow-sm">
											<h3 className="font-semibold mb-4 flex items-center">
												<FileCheck className="h-4 w-4 mr-2 text-primary" />{" "}
												Proof Documents
											</h3>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
												{proofImages.map((imgSrc, idx) => (
													<div
														key={idx}
														className="relative group overflow-hidden rounded-md border aspect-[3/4]"
													>
														<Image
															src={imgSrc}
															alt={`Proof ${idx + 1}`}
															fill
															className="object-cover transition-transform hover:scale-105"
															unoptimized
														/>
														<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
															<Button
																size="sm"
																variant="secondary"
																onClick={() => {
																	const win = window.open();
																	win?.document.write(
																		'<img src="' +
																			imgSrc +
																			'" style="max-width:100%; height:auto;">'
																	);
																}}
															>
																View Full
															</Button>
														</div>
													</div>
												))}
											</div>
										</div>
									)}

									<div className="p-4 bg-white border rounded-md shadow-sm">
										<h3 className="font-semibold mb-2 flex items-center">
											<FileText className="h-4 w-4 mr-2 text-primary" />{" "}
											Research & Publications
										</h3>
										<p className="text-sm text-muted-foreground mb-2">
											Original Claim:{" "}
											<span className="text-foreground font-bold">
												{selectedFaculty.score}
											</span>
										</p>
										<div className="text-sm space-y-2">
											{/* Render raw data scores to verify claims */}
											{Object.keys(selectedFaculty.rawData).map((key) => {
												const keysToIgnore = ["1-10", "user_id", "hod_review", "frontend_progress", "_id"];
												if (keysToIgnore.includes(key)) return null;
												const sectionData = selectedFaculty.rawData[key];
												if (!sectionData || typeof sectionData !== "object") return null;
												
												return (
													<div
														key={key}
														className="border-l-2 border-primary/20 pl-3 py-1"
													>
														<span className="font-medium text-xs uppercase text-muted-foreground">
															Item {key}
														</span>
														<div className="text-xs truncate max-w-full text-foreground/80">
															Score: {sectionData.score || 0}
														</div>
													</div>
												);
											})}

											{/* Render frontend_progress scores for sections like generalDetails */}
											{selectedFaculty.rawData.frontend_progress && 
												Object.keys(selectedFaculty.rawData.frontend_progress).map((fpKey) => {
													if (fpKey === "sectionStatus") return null;
													const fpSection = selectedFaculty.rawData.frontend_progress[fpKey];
													if (!fpSection || typeof fpSection !== "object" || !("apiScore" in fpSection)) return null;
													
													return (
														<div
															key={`fp-${fpKey}`}
															className="border-l-2 border-primary/20 pl-3 py-1 bg-muted/20"
														>
															<span className="font-medium text-xs uppercase text-muted-foreground">
																{fpKey.replace(/([A-Z])/g, ' $1').trim()} (Frontend)
															</span>
															<div className="text-xs truncate max-w-full text-foreground/80">
																Score: {fpSection.apiScore || 0}
															</div>
														</div>
													);
												})
											}
											
											{/* Fallback for general details if frontend_progress is missing but 1-10 exists */}
											{!selectedFaculty.rawData.frontend_progress && selectedFaculty.rawData["1-10"] && (
												<div className="border-l-2 border-primary/20 pl-3 py-1 bg-muted/20">
													<span className="font-medium text-xs uppercase text-muted-foreground">
														General Details (Fallback)
													</span>
													<div className="text-xs truncate max-w-full text-foreground/80">
														Score: 10
													</div>
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
						<div className="md:col-span-1">
							<Card className="sticky top-6">
								<CardHeader>
									<CardTitle>HOD Review</CardTitle>
									<CardDescription>
										Validate score and add remarks
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<label className="text-sm font-medium">
											Verified Score
										</label>
										<input
											type="number"
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
											value={reviewScore}
											onChange={(e) => setReviewScore(Number(e.target.value))}
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium">Remarks</label>
										<textarea
											className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none"
											placeholder="Enter specific feedback..."
											value={reviewRemark}
											onChange={(e) => setReviewRemark(e.target.value)}
										/>
									</div>
									<div className="pt-2 flex flex-col gap-3">
										<Button
											className="w-full bg-green-600 hover:bg-green-700"
											onClick={handleApprove}
											disabled={isUpdating}
										>
											<CheckCircle2 className="mr-2 h-4 w-4" /> {isUpdating ? "Processing..." : "Approve Appraisal"}
										</Button>
										<Button
											variant="outline"
											className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
											onClick={handleSendBack}
											disabled={isUpdating}
										>
											<XCircle className="mr-2 h-4 w-4" /> {isUpdating ? "Processing..." : "Send Back"}
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// --- VIEW 1: MAIN DASHBOARD ---
	return (
		<div className="min-h-screen bg-muted/30">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				{/* Header Section - Stacked on Mobile */}
				<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Department Dashboard
						</h1>
						<p className="text-muted-foreground">
							Overview of faculty performance appraisals
						</p>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						<Button
							variant="outline"
							onClick={() => setShowChangePassword(true)}
							className="gap-2"
						>
							<KeyRound className="h-4 w-4" />
							<span className="hidden sm:inline">Change Password</span>
						</Button>
						<Button
							variant="outline"
							onClick={handleOpenManageFaculty}
							className="gap-2"
						>
							<Settings className="h-4 w-4" />
							<span className="hidden sm:inline">Manage Faculty</span>
						</Button>
						<Button
							variant="outline"
							onClick={handleDownloadReport}
							className="gap-2"
						>
							<Download className="h-4 w-4" />
							<span className="hidden sm:inline">Download Report</span>
						</Button>
						<Button
							variant="ghost"
							onClick={() => signOut({ callbackUrl: "/login" })}
						>
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
									Change Admin Password
								</CardTitle>
								<CardDescription>
									Enter your current password and choose a new one
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleChangePassword} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="admin-current-password">Current Password</Label>
										<Input
											id="admin-current-password"
											type="password"
											placeholder="Enter current password"
											value={currentPassword}
											onChange={(e) => setCurrentPassword(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="admin-new-password">New Password</Label>
										<Input
											id="admin-new-password"
											type="password"
											placeholder="At least 6 characters"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="admin-confirm-password">Confirm New Password</Label>
										<Input
											id="admin-confirm-password"
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

				{/* Manage Faculty Modal */}
				{showManageFaculty && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
						<Card className="w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col">
							<CardHeader className="relative flex-shrink-0">
								<Button
									variant="ghost"
									size="sm"
									className="absolute right-4 top-4"
									onClick={() => {
										setShowManageFaculty(false);
										setShowOnboardForm(false);
										setRemovingCode(null);
									}}
								>
									<X className="h-4 w-4" />
								</Button>
								<CardTitle className="flex items-center gap-2">
									<Users className="h-5 w-5 text-primary" />
									Manage Faculty
								</CardTitle>
								<CardDescription>
									Onboard new faculty or remove existing members ({managedFacultyList.length} total)
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1 overflow-hidden flex flex-col">
								{/* Actions Bar */}
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
									<Button
										onClick={() => setShowOnboardForm(!showOnboardForm)}
										className="gap-2"
										variant={showOnboardForm ? "secondary" : "default"}
									>
										<UserPlus className="h-4 w-4" />
										{showOnboardForm ? "Cancel Onboarding" : "Onboard New Faculty"}
									</Button>
									<div className="relative flex-1 w-full">
										<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search by name, code, or email..."
											value={manageFacultySearch}
											onChange={(e) => setManageFacultySearch(e.target.value)}
											className="pl-8"
										/>
									</div>
								</div>

								{/* Onboard Form */}
								{showOnboardForm && (
									<Card className="mb-4 border-primary/30 bg-primary/5">
										<CardContent className="pt-4">
											<form onSubmit={handleOnboardFaculty} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
												<div className="space-y-1">
													<Label className="text-xs">Employee Code *</Label>
													<Input
														placeholder="e.g., JIIT2300"
														value={onboardData.employeeCode}
														onChange={(e) => setOnboardData({ ...onboardData, employeeCode: e.target.value })}
														required
													/>
												</div>
												<div className="space-y-1">
													<Label className="text-xs">Full Name *</Label>
													<Input
														placeholder="e.g., JOHN DOE"
														value={onboardData.name}
														onChange={(e) => setOnboardData({ ...onboardData, name: e.target.value })}
														required
													/>
												</div>
												<div className="space-y-1">
													<Label className="text-xs">Email *</Label>
													<Input
														type="email"
														placeholder="e.g., john.doe@jiit.ac.in"
														value={onboardData.email}
														onChange={(e) => setOnboardData({ ...onboardData, email: e.target.value })}
														required
													/>
												</div>
												<div className="space-y-1">
													<Label className="text-xs">Department</Label>
													<Input
														placeholder="Department"
														value={onboardData.department}
														onChange={(e) => setOnboardData({ ...onboardData, department: e.target.value })}
													/>
												</div>
												<div className="space-y-1">
													<Label className="text-xs">Designation</Label>
													<Input
														placeholder="e.g., ASSISTANT PROFESSOR"
														value={onboardData.designation}
														onChange={(e) => setOnboardData({ ...onboardData, designation: e.target.value })}
													/>
												</div>
												<div className="space-y-1">
													<Label className="text-xs">Unit</Label>
													<Input
														placeholder="e.g., JIIT Noida Sec-62"
														value={onboardData.unit}
														onChange={(e) => setOnboardData({ ...onboardData, unit: e.target.value })}
													/>
												</div>
												<div className="sm:col-span-2 flex justify-end gap-2 pt-2">
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={() => setShowOnboardForm(false)}
													>
														Cancel
													</Button>
													<Button type="submit" size="sm" disabled={isOnboarding} className="gap-2">
														{isOnboarding ? (
															<><Loader2 className="h-3 w-3 animate-spin" /> Adding...</>
														) : (
															<><UserPlus className="h-3 w-3" /> Add Faculty</>
														)}
													</Button>
												</div>
												<p className="sm:col-span-2 text-xs text-muted-foreground">
													Default password: <code className="bg-muted px-1 rounded">Jiit@128</code> — Faculty must verify via OTP on first login.
												</p>
											</form>
										</CardContent>
									</Card>
								)}

								{/* Faculty List */}
								<div className="flex-1 overflow-y-auto rounded-md border">
									{isFetchingFaculty ? (
										<div className="p-8 flex justify-center text-muted-foreground">
											<Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading faculty list...
										</div>
									) : (
										<table className="w-full text-sm text-left">
											<thead className="bg-muted/50 font-medium text-muted-foreground sticky top-0">
												<tr>
													<th className="p-3">Code</th>
													<th className="p-3">Name</th>
													<th className="p-3 hidden md:table-cell">Email</th>
													<th className="p-3 hidden lg:table-cell">Designation</th>
													<th className="p-3 text-center">Verified</th>
													<th className="p-3 text-right">Action</th>
												</tr>
											</thead>
											<tbody>
												{filteredManagedFaculty.length > 0 ? (
													filteredManagedFaculty.map((f) => (
														<tr key={f.id} className="border-t hover:bg-muted/50 transition-colors">
															<td className="p-3 font-mono text-xs">{f.employeeCode}</td>
															<td className="p-3 font-medium whitespace-nowrap">{f.name}</td>
															<td className="p-3 text-muted-foreground hidden md:table-cell text-xs">{f.email}</td>
															<td className="p-3 text-muted-foreground hidden lg:table-cell text-xs">{f.designation || "—"}</td>
															<td className="p-3 text-center">
																<Badge variant="outline" className={f.isVerified ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
																	{f.isVerified ? "Yes" : "No"}
																</Badge>
															</td>
															<td className="p-3 text-right">
																{removingCode === f.employeeCode ? (
																	<div className="flex items-center justify-end gap-2">
																		<span className="text-xs text-red-600">Confirm?</span>
																		<Button
																			size="sm"
																			variant="destructive"
																			disabled={isRemoving}
																			onClick={() => handleRemoveFaculty(f.employeeCode)}
																			className="h-7 px-2 text-xs"
																		>
																			{isRemoving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Yes, Remove"}
																		</Button>
																		<Button
																			size="sm"
																			variant="outline"
																			onClick={() => setRemovingCode(null)}
																			className="h-7 px-2 text-xs"
																		>
																			No
																		</Button>
																	</div>
																) : (
																	<Button
																		size="sm"
																		variant="outline"
																		onClick={() => setRemovingCode(f.employeeCode)}
																		className="h-7 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
																	>
																		<UserMinus className="h-3 w-3" /> Remove
																	</Button>
																)}
															</td>
														</tr>
													))
												) : (
													<tr>
														<td colSpan={6} className="p-8 text-center text-muted-foreground">
															{manageFacultySearch ? `No faculty matching "${manageFacultySearch}"` : "No faculty members found"}
														</td>
													</tr>
												)}
											</tbody>
										</table>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{isLoading ? (
					<div className="p-12 flex justify-center text-muted-foreground">
						Loading dashboard data...
					</div>
				) : (
					<>
						{/* Live Analytics Cards */}
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium">
										Total Faculty
									</CardTitle>
									<Users className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats.total}</div>
									<p className="text-xs text-muted-foreground">
										Active members
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium">
										Submissions
									</CardTitle>
									<FileCheck className="h-4 w-4 text-blue-500" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats.submitted}</div>
									<Progress
										value={
											stats.total > 0
												? (stats.submitted / stats.total) * 100
												: 0
										}
										className="h-2 mt-2"
									/>
									<p className="text-xs text-muted-foreground mt-1">
										{stats.total > 0
											? ((stats.submitted / stats.total) * 100).toFixed(0)
											: 0}
										% Completed
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium">
										Pending Reviews
									</CardTitle>
									<Clock className="h-4 w-4 text-amber-500" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats.pending}</div>
									<p className="text-xs text-muted-foreground">
										Requires attention
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium">
										Avg. Score
									</CardTitle>
									<BarChart3 className="h-4 w-4 text-green-500" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats.avg}</div>
									<p className="text-xs text-muted-foreground">
										Based on submitted
									</p>
								</CardContent>
							</Card>
						</div>

						{/* Responses Table */}
						<Card>
							<CardHeader>
								<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
									<div>
										<CardTitle>Faculty Submissions</CardTitle>
										<CardDescription>
											Manage and review submitted forms
										</CardDescription>
									</div>
									<div className="flex flex-col sm:flex-row items-center gap-4">
										{/* Tabs */}
										<div className="flex bg-muted p-1 rounded-md">
											<Button
												variant={activeTab === "Pending Review" ? "default" : "ghost"}
												size="sm"
												className="rounded-sm"
												onClick={() => setActiveTab("Pending Review")}
											>
												Pending
											</Button>
											<Button
												variant={activeTab === "Reviewed" ? "default" : "ghost"}
												size="sm"
												className="rounded-sm"
												onClick={() => setActiveTab("Reviewed")}
											>
												Approved
											</Button>
											<Button
												variant={activeTab === "Returned" ? "default" : "ghost"}
												size="sm"
												className="rounded-sm"
												onClick={() => setActiveTab("Returned")}
											>
												Sent Back
											</Button>
										</div>
										<div className="relative w-full sm:w-64">
											<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
											<input
												placeholder="Search name..."
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
											/>
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{/* THIS LINE FIXES THE TABLE SCROLL ISSUE */}
								<div className="rounded-md border overflow-x-auto">
									<table className="w-full text-sm text-left min-w-[800px]">
										<thead className="bg-muted/50 font-medium text-muted-foreground">
											<tr>
												<th className="p-4">Faculty Name</th>
												<th className="p-4">Designation</th>
												<th className="p-4">Submitted Date</th>
												<th className="p-4">API Score</th>
												<th className="p-4">Status</th>
												<th className="p-4 text-right">Action</th>
											</tr>
										</thead>
										<tbody>
											{filteredFaculty.length > 0 ? (
												filteredFaculty.map((faculty) => (
													<tr
														key={faculty.id}
														className="border-t hover:bg-muted/50 transition-colors"
													>
														<td className="p-4 font-medium whitespace-nowrap">
															{faculty.name}
														</td>
														<td className="p-4 whitespace-nowrap">
															{faculty.designation}
														</td>
														<td className="p-4 text-muted-foreground whitespace-nowrap">
															{faculty.date}
														</td>
														<td className="p-4 font-bold">{faculty.score}</td>
														<td className="p-4">
															<Badge
																variant="outline"
																className={getStatusColor(faculty.status)}
															>
																{faculty.status}
															</Badge>
														</td>
														<td className="p-4 text-right">
															<Button
																size="sm"
																variant="outline"
																disabled={faculty.status === "Not Submitted"}
																onClick={() => handleOpenReview(faculty)}
																className="w-28"
															>
																{faculty.status === "Reviewed"
																	? "View Details"
																	: "Review"}
															</Button>
														</td>
													</tr>
												))
											) : (
												<tr>
													<td
														colSpan={6}
														className="p-8 text-center text-muted-foreground"
													>
														No faculty found matching &quot;{searchQuery}&quot;
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</>
				)}
			</div>
		</div>
	);
}
