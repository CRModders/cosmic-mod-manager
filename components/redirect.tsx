"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sleep } from "@/lib/utils";

type Props = {
	children?: React.ReactNode;
	text?: string;
	url: string;
	timeoutMs?: number;
	pushToStack?: boolean;
};

const Redirect = ({ children, text, url, timeoutMs = 0, pushToStack = false }: Props) => {
	const router = useRouter();

	const redirectUser = async () => {
		if (timeoutMs > 0) {
			await sleep(timeoutMs);
		}
		if (!pushToStack) {
			router.replace(url);
		} else {
			router.push(url);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		redirectUser();
	}, []);

	return (
		<div className="container flex items-center justify-center">
			{children ? (
				children
			) : (
				<p className="w-full flex items-center justify-center text-2xl">{text ? text : "Redirecting..."}</p>
			)}
		</div>
	);
};

export default Redirect;
