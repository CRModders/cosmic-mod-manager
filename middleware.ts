//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. 

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
	console.log({
		IP: request.ip,
		GEO: request.geo,
	});

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
