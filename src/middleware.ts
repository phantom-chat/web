import { request } from "http";
import { type NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/"];
export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const apikey = request.cookies.has("phantom-token");
	const isProtectedRoute = protectedRoutes.some((route) =>
		path.startsWith(route),
	);

	if (isProtectedRoute && !apikey && path !== "/login" && path !== "/signup") {
		return NextResponse.redirect(new URL("/login", request.nextUrl));
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
