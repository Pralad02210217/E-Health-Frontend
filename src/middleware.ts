import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Define routes that require 'HA' user role
const haOnlyRoutes = ["/dashboard", "/inventory","/inventory/medicines", "/illness", "/illnessCategory", "/history", "/leaves", "/feeds", "/treatment"];

// Combine all protected routes
const protectedRoutes = [...haOnlyRoutes, "/users/home", "/users/profile"];

const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/confirm-account",
    "/forgot-password",
    "/reset-password",
    "/verify-mfa",
];

// Define the structure of the Access Token payload
interface AccessTokenPayload {
    userId: string;
    sessionId: string;
    userType: string;
}

// Function to get the JWT secret key
function getJwtSecretKey(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT Secret key is not set in environment variables");
    }
    return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const accessToken = req.cookies.get("accessToken")?.value;

    // ✅ Allow access to public routes freely
    if (publicRoutes.some(route => path.startsWith(route))) {
        if (accessToken) {
            try {
                const { payload } = await jwtVerify<AccessTokenPayload>(accessToken, getJwtSecretKey(), {
                    audience: "user",
                    algorithms: ["HS256"],
                });
                const redirectUrl = payload.userType === "HA" ? "/" : "/users/home";
                if (path !== redirectUrl) {
                    return NextResponse.redirect(new URL(redirectUrl, req.url));
                }
            } catch (error) {
                return NextResponse.next(); // If token is invalid, allow them to access public pages
            }
        }
        return NextResponse.next();
    }

    // ✅ Require authentication for protected routes
    if (!accessToken) {
        const signInUrl = new URL("/sign-in", req.url);
        signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
    }

    try {
        const { payload } = await jwtVerify<AccessTokenPayload>(accessToken, getJwtSecretKey(), {
            audience: "user",
            algorithms: ["HS256"],
        });

        // ✅ Prevent non-HA users from accessing HA-only routes
        if (haOnlyRoutes.some(route => path.startsWith(route)) && payload.userType !== "HA") {
            return NextResponse.redirect(new URL("/users/home", req.url));
        }

        // ✅ Prevent non-HA users from getting stuck in an infinite loop at "/"
        if (path === "/" && payload.userType !== "HA") {
            return NextResponse.redirect(new URL("/users/home", req.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Access token verification failed:", error);
        const signInUrl = new URL("/sign-in", req.url);
        signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        const response = NextResponse.redirect(signInUrl);
        response.cookies.delete("accessToken");
        return response;
    }
}

export const config = {
    matcher: [
        "/",
        "/dashboard",
        "/inventory",
        "/inventory/medicines",
        "/illness",
        "/illnessCategory",
        "/history",
        "/leaves",
        "/feeds",
        "/treatment",
        "/users/home",
        "/users/profile",
        "/users/settings",
        "/sign-in",
        "/sign-up",
        "/confirm-account",
        "/forgot-password",
        "/reset-password",
        "/verify-mfa",
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
