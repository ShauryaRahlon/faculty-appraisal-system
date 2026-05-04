import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function DELETE(req: Request) {
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

        const { employeeCode } = await req.json();

        if (!employeeCode) {
            return NextResponse.json({ error: "Employee code is required" }, { status: 400 });
        }

        // Prevent admin from removing themselves
        if (employeeCode === "ADMIN") {
            return NextResponse.json({ error: "Cannot remove the admin account" }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ employeeCode });

        if (!user) {
            return NextResponse.json({ error: "Faculty member not found" }, { status: 404 });
        }

        if (user.role === "admin") {
            return NextResponse.json({ error: "Cannot remove admin users" }, { status: 400 });
        }

        await User.deleteOne({ employeeCode });

        return NextResponse.json({
            message: `Faculty "${user.name}" (${employeeCode}) removed successfully`,
        });
    } catch (error) {
        console.error("Faculty Remove Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
