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
