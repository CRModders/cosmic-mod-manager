"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { createContext, useState } from "react";

type StoreContextValues = {
	isNavMenuOpen: boolean;
	toggleNavMenu: (newState?: boolean) => void;
};

export const StoreContext = createContext({
	isNavMenuOpen: false,
} as StoreContextValues);

export default function StoreContextProvider({
	children,
}: { children: React.ReactNode }) {
	const [isNavMenuOpen, setIsNavMenuOpen] = useState<boolean>(false);

	const toggleNavMenu = (newState?: boolean) => {
		setIsNavMenuOpen((current) =>
			newState === true || newState === false ? newState : !current,
		);
	};

	return (
		<StoreContext.Provider
			value={{
				isNavMenuOpen,
				toggleNavMenu,
			}}
		>
			{children}
		</StoreContext.Provider>
	);
}
