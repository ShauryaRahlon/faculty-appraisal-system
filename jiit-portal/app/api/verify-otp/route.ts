import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const { identifier, otp } = await req.json();

        if (!identifier || !otp) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await dbConnect();

        // Find user by either email OR employeeCode
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { employeeCode: identifier }
            ]
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return NextResponse.json({ error: "Invalid OTP. Please check your email." }, { status: 400 });
        }

        // Check expiry
        if (new Date() > user.otpExpires) {
            return NextResponse.json({ error: "OTP has expired. Please login again to get a new one." }, { status: 400 });
        }

        // Mark user as verified (this will allow them to login with NextAuth)
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        return NextResponse.json({ message: "OTP Verified" });
    } catch (error) {
        console.error("Verify OTP Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}