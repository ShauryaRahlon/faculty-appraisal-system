"use client";

import { useState, useMemo } from "react";
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
    Users,
    FileCheck,
    Clock,
    BarChart3,
    Search,
    ChevronLeft,
    CheckCircle2,
    XCircle,
    FileText,
    Download
} from "lucide-react";

// Local lightweight Badge fallback
const Badge = ({ children, className = "", variant }: any) => {
    const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
    const variantClasses = variant === "outline" ? "border" : "";
    return <span className={`${base} ${variantClasses} ${className}`.trim()}>{children}</span>;
};

// --- INITIAL DUMMY DATA ---
const INITIAL_DATA = [
    {
        id: 1,
        name: "Dr. Rajesh Kumar",
        designation: "Associate Professor",
        score: 145,
        status: "Pending Review",
        date: "2024-03-15",
        department: "Computer Science",
        joiningDate: "12th Aug 2018"
    },
    {
        id: 2,
        name: "Dr. Sarah Smith",
        designation: "Assistant Professor",
        score: 162,
        status: "Reviewed",
        date: "2024-03-10",
        department: "Computer Science",
        joiningDate: "1st Sep 2019"
    },
    {
        id: 3,
        name: "Prof. Amit Sharma",
        designation: "Professor",
        score: 0,
        status: "Not Submitted",
        date: "-",
        department: "Information Tech",
        joiningDate: "10th July 2010"
    },
    {
        id: 4,
        name: "Dr. Priya Desai",
        designation: "Assistant Professor",
        score: 138,
        status: "Pending Review",
        date: "2024-03-18",
        department: "Computer Science",
        joiningDate: "5th Jan 2021"
    },
    {
        id: 5,
        name: "Dr. John Doe",
        designation: "Associate Professor",
        score: 150,
        status: "Returned",
        date: "2024-03-20",
        department: "Computer Science",
        joiningDate: "15th Mar 2017"
    },
];

export default function HODDashboard() {
    // --- STATE MANAGEMENT ---
    const [facultyList, setFacultyList] = useState(INITIAL_DATA);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState<any | null>(null);
    const [reviewScore, setReviewScore] = useState(0);
    const [reviewRemark, setReviewRemark] = useState("");

    // --- COMPUTED VALUES ---
    const filteredFaculty = facultyList.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = useMemo(() => {
        const total = facultyList.length;
        const submitted = facultyList.filter(f => f.status !== "Not Submitted").length;
        const pending = facultyList.filter(f => f.status === "Pending Review").length;
        const totalScore = facultyList.reduce((acc, curr) => acc + (curr.status !== "Not Submitted" ? curr.score : 0), 0);
        const avg = submitted > 0 ? (totalScore / submitted).toFixed(1) : 0;
        return { total, submitted, pending, avg };
    }, [facultyList]);

    // --- ACTIONS ---
    const handleDownloadReport = () => {
        const headers = ["ID,Name,Designation,Department,Score,Status,Date\n"];
        const rows = facultyList.map(f =>
            `${f.id},"${f.name}","${f.designation}","${f.department}",${f.score},"${f.status}","${f.date}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "faculty_appraisal_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpenReview = (faculty: any) => {
        setSelectedFaculty(faculty);
        setReviewScore(faculty.score);
        setReviewRemark("");
    };

    const handleApprove = () => {
        if (!selectedFaculty) return;
        const updatedList = facultyList.map(f => {
            if (f.id === selectedFaculty.id) return { ...f, status: "Reviewed", score: reviewScore };
            return f;
        });
        setFacultyList(updatedList);
        setSelectedFaculty(null);
    };

    const handleSendBack = () => {
        if (!selectedFaculty) return;
        const updatedList = facultyList.map(f => {
            if (f.id === selectedFaculty.id) return { ...f, status: "Returned" };
            return f;
        });
        setFacultyList(updatedList);
        setSelectedFaculty(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Reviewed": return "bg-green-100 text-green-700 border-green-200";
            case "Pending Review": return "bg-amber-100 text-amber-700 border-amber-200";
            case "Returned": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    // --- VIEW 2: REVIEW MODE ---
    if (selectedFaculty) {
        return (
            <div className="min-h-screen bg-muted/30 p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all" onClick={() => setSelectedFaculty(null)}>
                        <ChevronLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                    </Button>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                        <div>
                                            <CardTitle className="text-xl md:text-2xl">{selectedFaculty.name}</CardTitle>
                                            <CardDescription>{selectedFaculty.designation}</CardDescription>
                                        </div>
                                        <Badge variant="outline" className={getStatusColor(selectedFaculty.status)}>
                                            {selectedFaculty.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="p-4 bg-white border rounded-md shadow-sm">
                                        <h3 className="font-semibold mb-2 flex items-center">
                                            <FileText className="h-4 w-4 mr-2 text-primary" /> General Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                            <div><span className="block font-medium text-foreground">Department</span> {selectedFaculty.department}</div>
                                            <div><span className="block font-medium text-foreground">Joining Date</span> {selectedFaculty.joiningDate}</div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white border rounded-md shadow-sm">
                                        <h3 className="font-semibold mb-2 flex items-center">
                                            <FileText className="h-4 w-4 mr-2 text-primary" /> Research & Publications
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-2">Original Claim: <span className="text-foreground font-bold">{selectedFaculty.score}</span></p>
                                        <ul className="list-disc pl-5 text-sm space-y-1">
                                            <li>"AI in Healthcare" - IEEE Journal (2024)</li>
                                            <li>"Next Gen Cloud" - Springer Conference (2023)</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="md:col-span-1">
                            <Card className="sticky top-6">
                                <CardHeader>
                                    <CardTitle>HOD Review</CardTitle>
                                    <CardDescription>Validate score and add remarks</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Verified Score</label>
                                        <input type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={reviewScore} onChange={(e) => setReviewScore(Number(e.target.value))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Remarks</label>
                                        <textarea className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none" placeholder="Enter specific feedback..." value={reviewRemark} onChange={(e) => setReviewRemark(e.target.value)} />
                                    </div>
                                    <div className="pt-2 flex flex-col gap-3">
                                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleApprove}><CheckCircle2 className="mr-2 h-4 w-4" /> Approve Appraisal</Button>
                                        <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleSendBack}><XCircle className="mr-2 h-4 w-4" /> Send Back</Button>
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
                        <h1 className="text-3xl font-bold tracking-tight">Department Dashboard</h1>
                        <p className="text-muted-foreground">Overview of faculty performance appraisals</p>
                    </div>
                    <div>
                        <Button variant="outline" onClick={handleDownloadReport} className="w-full md:w-auto">
                            <Download className="mr-2 h-4 w-4" /> Download Report
                        </Button>
                    </div>
                </div>

                {/* Live Analytics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">Active members</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                            <FileCheck className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.submitted}</div>
                            <Progress value={(stats.submitted / stats.total) * 100} className="h-2 mt-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                                {((stats.submitted / stats.total) * 100).toFixed(0)}% Completed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground">Requires attention</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
                            <BarChart3 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.avg}</div>
                            <p className="text-xs text-muted-foreground">Based on submitted</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Responses Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Faculty Submissions</CardTitle>
                                <CardDescription>Manage and review submitted forms</CardDescription>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    placeholder="Search name..."
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
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
                                            <tr key={faculty.id} className="border-t hover:bg-muted/50 transition-colors">
                                                <td className="p-4 font-medium whitespace-nowrap">{faculty.name}</td>
                                                <td className="p-4 whitespace-nowrap">{faculty.designation}</td>
                                                <td className="p-4 text-muted-foreground whitespace-nowrap">{faculty.date}</td>
                                                <td className="p-4 font-bold">{faculty.score}</td>
                                                <td className="p-4">
                                                    <Badge variant="outline" className={getStatusColor(faculty.status)}>
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
                                                        {faculty.status === "Reviewed" ? "View Details" : "Review"}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                No faculty found matching "{searchQuery}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}