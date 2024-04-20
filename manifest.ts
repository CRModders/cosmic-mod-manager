import type { MetadataRoute } from "next";
import { siteTitle } from "./config";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteTitle,
		short_name: "CRMM",
		description: "One stop solution for all cosmic reach mods.",
		start_url: "/",
		display: "standalone",
		background_color: "#FAFCFF",
		theme_color: "#FAFCFF",
		icons: [
			{
				src: "/public/images/icon-192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/public/images/icon-512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
