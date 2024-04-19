//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import type React from "react";
import { Card } from "../ui/card";

type SidePanelProps = {
	children: React.ReactNode;
};

export const SidePanel = async ({ children }: SidePanelProps) => {
	return <Card className="w-full px-4 py-4 rounded-lg lg:w-80 shadow-none">{children}</Card>;
};

type PanelContentProps = {
	children: React.ReactNode;
};

export const PanelContent = async ({ children }: PanelContentProps) => {
	return <section className="grow max-w-full flex items-center justify-center rounded-lg lg:w-64">{children}</section>;
};

type Props = {
	children: React.ReactNode;
};

const PanelLayout = ({ children }: Props) => {
	return <div className="w-full flex flex-wrap items-start justify-start gap-8 mt-4">{children}</div>;
};

export default PanelLayout;
