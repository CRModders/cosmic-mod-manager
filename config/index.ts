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
		name: "Modpacks",
		href: "/modpacks",
	},
	{
		name: "Shaders",
		href: "/shaders",
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
		name: "Modpacks",
		href: "/modpacks",
	},
	{
		name: "Shaders",
		href: "/shaders",
	},
];

export { NavLinks, NavMenuLinks };

// Route types
export const authRouteApiPrefix = "/api/auth";
export const authRoutes = ["/login", "/register"];
export const protectedRoutes = ["/dashboard", "/settings"];

export const defaultLoginRedirect = "/dashboard";

export const maxNameLength = 32;
export const maxUsernameLength = 32;

export const minPasswordLength = 8;
export const maxPasswordLength = 64;

export const passwordHashingSaltRounds = 8;
