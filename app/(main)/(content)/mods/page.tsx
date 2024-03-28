//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. 

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
