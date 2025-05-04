// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// // Routes only accessible by 'HA'
// const haOnlyRoutes = [
//     "/dashboard",
//     "/inventory",
//     "/inventory/medicines",
//     "/illness",
//     "/illnessCategory",
//     "/history",
//     "/leaves",
//     "/feeds",
//     "/treatment",
// ];

// // All protected routes
// const protectedRoutes = [
//     ...haOnlyRoutes,
//     "/users/home",
//     "/users/profile",
//     "/users/settings",
//     "/users/dean",
//     "/users/student",
//     "/users/history",
//     "/users/feeds",
// ];

// // Publicly accessible
// const publicRoutes = [
//     "/sign-in",
//     "/sign-up",
//     "/confirm-account",
//     "/forgot-password",
//     "/reset-password",
//     "/verify-mfa",
// ];

// // Role-based forbidden routes
// const forbiddenRoutesByRole: Record<string, string[]> = {
//     STUDENT: [...haOnlyRoutes, "/users/student", "/users/dean"],
//     STAFF: [...haOnlyRoutes, "/users/dean"],
//     HA: [], // No restrictions
// };

// // JWT payload shape
// interface AccessTokenPayload {
//     userId: string;
//     sessionId: string;
//     userType: string;
// }

// // Get JWT secret key
// function getJwtSecretKey(): Uint8Array {
//     const secret = process.env.JWT_SECRET;
//     if (!secret) throw new Error("JWT Secret key is not set");
//     return new TextEncoder().encode(secret);
// }

// // Middleware
// export async function middleware(req: NextRequest) {
//     const path = req.nextUrl.pathname;
//     const accessToken = req.cookies.get("accessToken")?.value;

//     // Allow access to public routes
//     if (publicRoutes.some(route => path.startsWith(route))) {
//         if (accessToken) {
//             try {
//                 const { payload } = await jwtVerify<AccessTokenPayload>(accessToken, getJwtSecretKey(), {
//                     audience: "user",
//                     algorithms: ["HS256"],
//                 });
//                 const redirectUrl = payload.userType === "HA" ? "/" : "/users/feeds";
//                 if (path !== redirectUrl) {
//                     return NextResponse.redirect(new URL(redirectUrl, req.url));
//                 }
//             } catch {
//                 return NextResponse.next();
//             }
//         }
//         return NextResponse.next();
//     }

//     // Require authentication for protected routes
//     if (!accessToken) {
//         const signInUrl = new URL("/sign-in", req.url);
//         signInUrl.searchParams.set("callbackUrl", path);
//         return NextResponse.redirect(signInUrl);
//     }

//     try {
//         const { payload } = await jwtVerify<AccessTokenPayload>(accessToken, getJwtSecretKey(), {
//             audience: "user",
//             algorithms: ["HS256"],
//         });

//         const userType = payload.userType;
//         const forbiddenRoutes = forbiddenRoutesByRole[userType] || [];

//         // Redirect if user tries to access forbidden route
//         if (forbiddenRoutes.some(route => path.startsWith(route))) {
//             return NextResponse.redirect(new URL("/users/feeds", req.url));
//         }

//         // Prevent non-HA users from accessing root path "/"
//         if (path === "/" && userType !== "HA") {
//             return NextResponse.redirect(new URL("/users/feeds", req.url));
//         }

//         return NextResponse.next();
//     } catch (error) {
//         console.error("Access token verification failed:", error);
//         const signInUrl = new URL("/sign-in", req.url);
//         signInUrl.searchParams.set("callbackUrl", path);
//         const response = NextResponse.redirect(signInUrl);
//         response.cookies.delete("accessToken");
//         return response;
//     }
// }

// // Routes middleware should match
// export const config = {
//     matcher: [
//         "/",
//         "/dashboard",
//         "/inventory",
//         "/inventory/medicines",
//         "/illness",
//         "/illnessCategory",
//         "/history",
//         "/leaves",
//         "/feeds",
//         "/treatment",
//         "/users/home",
//         "/users/profile",
//         "/users/settings",
//         "/users/dean",
//         "/users/student",
//         "/users/history",
//         "/users/feeds",
//         "/sign-in",
//         "/sign-up",
//         "/confirm-account",
//         "/forgot-password",
//         "/reset-password",
//         "/verify-mfa",
//         "/((?!api|_next/static|_next/image|favicon.ico).*)",
//     ],
// };
