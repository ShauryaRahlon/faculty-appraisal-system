import { NextResponse } from "next/server";
import { auth } from "@/auth"; // <-- Import the v5 auth wrapper

const publicRoutes = ["/login", "/verify-otp", "/change-password"];
const adminRoutes = ["/hod"];

// Wrap your middleware with auth()
export default auth((req) => {
    const { pathname } = req.nextUrl;

    // In v5, req.auth contains your session object
    const session = req.auth;

    // Allow public routes
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        // If user is already logged in and visits /login, redirect to their dashboard
        if (session && pathname.startsWith("/login")) {
            const role = (session.user as any)?.role;
            const redirectUrl = role === "admin" ? "/hod/dashboard" : "/dashboard";
            return NextResponse.redirect(new URL(redirectUrl, req.url));
        }
        return NextResponse.next();
    }

    // If not authenticated, redirect to login
    if (!session) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Check admin routes — only admin role can access /hod/*
    const role = (session.user as any)?.role;
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
        if (role !== "admin") {
            // Non-admin trying to access HOD pages → bounce to faculty dashboard
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    return NextResponse.next();
});

// Run middleware on all routes EXCEPT static files, images, and API routes
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|logo.png|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};