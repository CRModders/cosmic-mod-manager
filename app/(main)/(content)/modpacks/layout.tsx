//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import React from "react";

export default async function ModpacksPageLayout({ children }: { children: React.ReactNode }) {
	return <section className="w-full flex items-center justify-center">{children}</section>;
}

export const generateMetadata = async () => {
	return {
		title: "Modpacks",
		description: "Modpacks on CRMM",
	};
};
