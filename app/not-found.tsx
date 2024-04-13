//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { title } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
	return (
		<div className="w-full min-h-[100vh] flex flex-col items-center justify-center gap-4">
			<div className="headings">
				<p
					className={`${title({
						size: "lg",
					})} w-full flex items-center justify-center text-center`}
				>
					404
				</p>
				<h1 className={`${title()} w-full flex items-center justify-center text-center`}>Page not found.</h1>
			</div>
			<p className="text-xl text-[var(--regular-secondary-text)] max-w-xl flex items-center justify-center text-center">
				Sorry, we couldn't find the page you're looking for.
			</p>

			<a href="/">
				<Button className="mt-4 rounded-lg py-4" size="lg" aria-label="Go to home page">
					<span className="px-8 text-xl">Home</span>
				</Button>
			</a>
		</div>
	);
}
