import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { identifier, password } = await req.json();

        if (!identifier || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await dbConnect();

        // Find user by email OR employee code
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { employeeCode: identifier }
            ]
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Check if user is already verified
        if (user.isVerified) {
            // User is verified, can proceed with NextAuth login
            return NextResponse.json({
                verified: true,
                message: "User is verified, proceed with login"
            });
        }

        // User is not verified - send OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await user.save();

        console.log(`Sending OTP ${otp} to ${user.email}`);
        await sendOtpEmail(user.email, otp);

        return NextResponse.json({
            verified: false,
            requiresOtp: true,
            email: user.email,
            message: "OTP sent to your email"
        });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
