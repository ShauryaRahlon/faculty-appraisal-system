import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
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

        const { employeeCode, name, email, department, designation, unit } = await req.json();

        // Validate required fields
        if (!employeeCode || !name || !email) {
            return NextResponse.json(
                { error: "Employee code, name, and email are required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check for duplicates
        const existingUser = await User.findOne({
            $or: [
                { employeeCode },
                { email }
            ]
        });

        if (existingUser) {
            const field = existingUser.employeeCode === employeeCode ? "Employee Code" : "Email";
            return NextResponse.json(
                { error: `A user with this ${field} already exists` },
                { status: 409 }
            );
        }

        // Create with default password (same as seed: "Jiit@128")
        const defaultPassword = "Jiit@128";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const newUser = await User.create({
            employeeCode,
            name: name.toUpperCase(),
            email: email.toLowerCase(),
            password: hashedPassword,
            department: department || "",
            designation: designation || "",
            unit: unit || "",
            role: "faculty",
            isVerified: false, // Forces OTP flow on first login
        });

        return NextResponse.json({
            message: `Faculty "${newUser.name}" onboarded successfully`,
            faculty: {
                id: newUser._id.toString(),
                employeeCode: newUser.employeeCode,
                name: newUser.name,
                email: newUser.email,
                department: newUser.department,
                designation: newUser.designation,
                unit: newUser.unit,
            },
        }, { status: 201 });
    } catch (error) {
        console.error("Faculty Onboard Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
