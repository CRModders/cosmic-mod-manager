import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Cosmic Reach Mod Manager",
		short_name: "CRMM",
		description: "One stop for all cosmic reach mods.",
		start_url: "/",
		display: "standalone",
		background_color: "#FAFCFF",
		theme_color: "#FAFCFF",
		icons: [
			{
				src: "/images/icon-192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/images/icon-512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
