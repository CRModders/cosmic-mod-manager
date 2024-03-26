//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. 
const NavLinks = [
	{
		name: "Mods",
		href: "/mods",
	},
	{
		name: "Resource Packs",
		href: "/resourcepacks",
	},
	{
		name: "Shaders",
		href: "/shaders",
	},
	{
		name: "Modpacks",
		href: "/modpacks",
	},
];

const NavMenuLinks = [
	{
		name: "Mods",
		href: "/mods",
	},
	{
		name: "Resource Packs",
		href: "/resourcepacks",
	},
	{
		name: "Shaders",
		href: "/shaders",
	},
	{
		name: "Modpacks",
		href: "/modpacks",
	},
];

export { NavLinks, NavMenuLinks };

// Route types
export const authRouteApiPrefix = "/api/auth";
export const authRoutes = ["/login", "/register"];
export const protectedRoutes = [
	"/dashboard",
	// "/settings"
];

export const defaultLoginRedirect = "/dashboard";

export const maxNameLength = 32;
export const maxUsernameLength = 32;
