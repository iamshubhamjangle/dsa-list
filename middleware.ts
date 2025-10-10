import { withAuth } from "next-auth/middleware";

// Add public paths here. These paths will be accessible without authentication
const PUBLIC_PATHS = [
  // Auth routes
  "/auth",
  "/auth/signin",
  "/auth/signout",
  // Public pages
  // "/about",
  // "/privacy",
  // "/terms",
  // Public API routes
  // "/api/public",
  // Add more public paths as needed
];

// Function to check if the current path is public
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if the path is public
        if (isPublicPath(req.nextUrl.pathname)) {
          return true;
        }
        // Require token for all other pages
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next (Next.js internals)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next|api/auth|favicon\\.ico|assets\\/).*)",
  ],
};
