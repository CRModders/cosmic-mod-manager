import { Mod_Item } from "@/types";

const FeaturedSectionList: {
	title: string;
	items: Mod_Item[];
}[] = [
	{
		title: "Popular Mods",
		items: [
			{
				name: "Sodium",
				description: "A performace mod",
				logo: "NONE",
				author: "Jellysquid",
				downloads: 7823478,
				lastUpdated: new Date(),
			},
			{
				name: "Lithium",
				description: "A mod aimed to improve server performace",
				logo: "NONE",
				author: "Jellysquid",
				downloads: 345436,
				lastUpdated: new Date(),
			},
			{
				name: "Furnicraft",
				description: "Add lots of amazing furnitures",
				logo: "NONE",
				author: "mod_author",
				downloads: 73464,
				lastUpdated: new Date(),
			},
		],
	},

	{
		title: "Popular Resource Packs",
		items: [
			{
				name: "Bare bones",
				description: "A bare bones texture pack",
				logo: "NONE",
				author: "Jellysquid",
				downloads: 7455,
				lastUpdated: new Date(),
			},
			{
				name: "Optifine grass texture",
				description: "Provides grass textures like optifine",
				logo: "NONE",
				author: "Jellysquid",
				downloads: 135452,
				lastUpdated: new Date(),
			},
			{
				name: "X-ray texture pack",
				description:
					"X-ray texture pack enables to see throught blocks and find ores",
				logo: "NONE",
				author: "mod_author",
				downloads: 35464,
				lastUpdated: new Date(),
			},
		],
	},
];

export default FeaturedSectionList;
