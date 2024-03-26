// "use client";

// import getMods from "@/app/api/actions/getMods";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";

const ModsPage = () => {
	// const [currentSort, setCurrentSort] = useState("popularity");

	// const fetchMods = async () => {
	// 	const res = await getMods();
	// 	setCurrentSort(res);
	// };

	// // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	// useEffect(() => {
	// 	fetchMods();
	// }, []);

	return (
		<div className="w-full min-h-[100dvh] flex flex-col items-center justify-center">
			<p className="text-2xl p-4">Mods</p>
			{/* 
			<p className="p-2">{currentSort}</p>

			<div className="w-full flex items-center justify-center gap-6">
				<Button
					type="button"
					onClick={async () => {
						const res = await getMods("Popularity");
						setCurrentSort(res);
					}}
				>
					Popularity
				</Button>

				<Button
					type="button"
					onClick={async () => {
						const res = await getMods("Release date");
						setCurrentSort(res);
					}}
				>
					Release date
				</Button>

				<Button
					type="button"
					onClick={async () => {
						const res = await getMods("Relevance");
						setCurrentSort(res);
					}}
				>
					Relevance
				</Button>
			</div> */}
		</div>
	);
};

export default ModsPage;
