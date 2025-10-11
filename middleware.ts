export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/manage", "/api/questions/:path*", "/api/tags/:path*"],
};
