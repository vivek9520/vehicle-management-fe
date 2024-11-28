// middleware.ts

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Check if the user is trying to access a protected route (like /dashboard)
  if (req.nextUrl.pathname.startsWith('/pages/dashboard')) {
    const token = req.cookies.get('authToken'); // or use req.headers if you use header-based auth

    if (!token) {
      // Redirect to login page if no token is found
      return NextResponse.redirect(new URL('/pages/login', req.url));
    }
  }

  // Continue processing the request
  return NextResponse.next();
}

export const config = {
  matcher: ['/pages/dashboard', '/pages/protected'], // Define the paths you want to protect
};
