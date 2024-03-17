"use client";

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
		setIsNavMenuOpen((current) => !current);
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
