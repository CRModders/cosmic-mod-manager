import NextAuth from "next-auth";
import authConfig from "./auth.config";

import {
	authRouteApiPrefix,
	authRoutes,
	defaultLoginRedirect,
	protectedRoutes,
} from "./config";

enum RouteTypes {
	public = "PUBLIC",
	authPage = "AUTH_PAGE",
	authApi = "AUTH_API",
	protected = "PROTECTED",
	modOnly = "MODERATOR_ONLY",
	adminOnly = "ADMIN_ONLY",
}

const isAuthApiRoute = (pathname: string): boolean => {
	return pathname.startsWith(authRouteApiPrefix);
};

const isAuthPage = (pathname: string): boolean => {
	return authRoutes.includes(pathname);
};

const isProtectedRoute = (pathname: string): boolean => {
	let result = false;

	for (const protectedRoute of protectedRoutes) {
		if (pathname.startsWith(protectedRoute)) {
			result = true;
			break;
		}
	}

	return result;
};

const { auth } = NextAuth(authConfig);

export default auth(async (request) => {
	// console.log(`IP_ADDRESS :  ${request.ip}`);
	// console.log({ request_geo: request.geo });

	const user = request?.auth?.user;
	const isAuthenticated = user?.email;

	const pathname = request.nextUrl.pathname;

	const routeType: RouteTypes = isAuthApiRoute(pathname)
		? RouteTypes.authApi
		: isAuthPage(pathname)
		  ? RouteTypes.authPage
		  : isProtectedRoute(pathname)
			  ? RouteTypes.protected
			  : RouteTypes.public;

	if (routeType === RouteTypes.authApi) return null;

	if (routeType === RouteTypes.authPage) {
		if (isAuthenticated) {
			return Response.redirect(new URL(defaultLoginRedirect, request.nextUrl));
		}
		return null;
	}

	if (routeType === RouteTypes.protected) {
		if (!isAuthenticated) {
			return Response.redirect(new URL("/login", request.nextUrl));
		}
		return null;
	}

	return null;
});
