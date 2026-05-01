import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that don't require authentication
const publicRoutes = ["/login", "/verify-otp", "/change-password"];

// Routes that require admin role
const adminRoutes = ["/hod"];

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Get the JWT token (does NOT require DB — works in Edge Runtime)
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    // Allow public routes
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        // If user is already logged in and visits /login, redirect to their dashboard
        if (token && pathname.startsWith("/login")) {
            const role = token.role as string;
            const redirectUrl = role === "admin" ? "/hod/dashboard" : "/dashboard";
            return NextResponse.redirect(new URL(redirectUrl, req.url));
        }
        return NextResponse.next();
    }

    // If not authenticated, redirect to login
    if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Check admin routes — only admin role can access /hod/*
    const role = token.role as string;
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
        if (role !== "admin") {
            // Non-admin trying to access HOD pages → bounce to faculty dashboard
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    return NextResponse.next();
}

// Run middleware on all routes EXCEPT static files, images, and API routes
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|logo.png|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};
