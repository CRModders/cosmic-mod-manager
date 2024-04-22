"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { createContext, useEffect, useState } from "react";
import UAParser from "ua-parser-js";

type StoreContextValues = {
	isNavMenuOpen: boolean;
	toggleNavMenu: (newState?: boolean) => void;
	isDesktop: boolean;
};

export const StoreContext = createContext({
	isNavMenuOpen: false,
} as StoreContextValues);

export default function StoreContextProvider({ children }: { children: React.ReactNode }) {
	const [isNavMenuOpen, setIsNavMenuOpen] = useState<boolean>(false);
	const [isDesktop, setIsDesktop] = useState<boolean | undefined>(undefined);

	const toggleNavMenu = (newState?: boolean) => {
		setIsNavMenuOpen((current) => (newState === true || newState === false ? newState : !current));
	};

	const determineDeviceType = (deviceType: string | null) => {
		setIsDesktop(deviceType === undefined || !["wearable", "mobile"].includes(deviceType));
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const parsedUserAgentData = new UAParser(navigator.userAgent).getResult();
		determineDeviceType(parsedUserAgentData.device.type);
	}, []);

	return (
		<StoreContext.Provider
			value={{
				isNavMenuOpen,
				toggleNavMenu,
				isDesktop,
			}}
		>
			{children}
		</StoreContext.Provider>
	);
}
