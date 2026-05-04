import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
    try {
        // Verify admin session
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const role = (session.user as any).role;
        if (role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        await dbConnect();

        // Fetch all faculty users (exclude admins), don't return password
        const faculty = await User.find(
            { role: "faculty" },
            {
                password: 0,
                otp: 0,
                otpExpires: 0,
                __v: 0,
            }
        ).sort({ name: 1 });

        return NextResponse.json({
            faculty: faculty.map((f) => ({
                id: f._id.toString(),
                employeeCode: f.employeeCode,
                name: f.name,
                email: f.email,
                department: f.department,
                designation: f.designation,
                unit: f.unit,
                isVerified: f.isVerified,
                createdAt: f.createdAt,
            })),
            total: faculty.length,
        });
    } catch (error) {
        console.error("Faculty List Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
