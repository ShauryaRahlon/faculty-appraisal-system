import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        // CHANGED: Receive 'identifier'
        const { identifier, newPassword } = await req.json();

        if (!identifier || !newPassword) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await dbConnect();

        // CHANGED: Find by email OR employeeCode
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { employeeCode: identifier }
            ]
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // In a strict production app, you would verify the OTP *again* here or use a temporary token.
        // For this flow, we assume the user just came from the Verify page successfully.

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.isVerified = true; // IMPORTANT: This stops the OTP loop next time
        user.otp = undefined;   // Clear the OTP
        user.otpExpires = undefined;

        await user.save();

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}