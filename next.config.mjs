/** @type {import('next').NextConfig} */

const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "**.co",
				port: "",
			},
		],
	},
};

export default nextConfig;
