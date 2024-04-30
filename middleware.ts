import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectdRoute = createRouteMatcher(["/"]);

export default clerkMiddleware((auth, request) => {
  if (isProtectdRoute(request)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
