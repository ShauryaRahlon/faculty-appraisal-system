import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
    await dbConnect();

    // 1. Data from your screenshot
    const rawData = [
        {
            SL: 1,
            UNITS: "JIIT Noida Sec-128",
            CODE: "JIIT1068",
            NAME: "KRISHNA ASAWA",
            CADRE: "REG",
            DEPARTMENT: "COMPUTER SCIENCE/ INFO. TECH.",
            DESIGNATION: "PROFESSOR"
        },
        {
            SL: 2,
            UNITS: "JIIT Noida Sec-128",
            CODE: "JIIT1137",
            NAME: "SHIKHA MEHTA",
            CADRE: "REG",
            DEPARTMENT: "COMPUTER SCIENCE/ INFO. TECH.",
            DESIGNATION: "PROFESSOR"
        },
        {
            SL: 3,
            UNITS: "JIIT Noida Sec-128",
            CODE: "JIIT1138",
            NAME: "Tashif Khan",
            CADRE: "REG",
            DEPARTMENT: "COMPUTER SCIENCE/ INFO. TECH.",
            DESIGNATION: "Dean of Student Welfare"
        }
        // ... add more rows here
    ];

    const defaultPasswordHash = await bcrypt.hash("jiit123", 10);
    let createdCount = 0;

    for (const row of rawData) {
        // Generate a dummy email if not provided
        // In production, you MUST provide real emails for OTP to work
        const generatedEmail = `${row.NAME.toLowerCase().replace(/\s+/g, '.')}@jiit.ac.in`;

        // Check if user exists
        const exists = await User.findOne({ employeeCode: row.CODE });

        if (!exists) {
            await User.create({
                employeeCode: row.CODE,
                name: row.NAME,
                email: generatedEmail, // This email receives the OTP
                password: defaultPasswordHash, // Default password for first login
                department: row.DEPARTMENT,
                designation: row.DESIGNATION,
                unit: row.UNITS,
                isVerified: false // Forces OTP flow on first login
            });
            createdCount++;
        }
    }

    return NextResponse.json({ message: `Seeded ${createdCount} users from faculty list.` });
}