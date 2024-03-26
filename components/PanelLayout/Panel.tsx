import React from "react";
import { Card } from "../ui/card";

type SidePanelProps = {
	children: React.ReactNode;
};

export const SidePanel = async ({ children }: SidePanelProps) => {
	return (
		<Card className="w-full px-4 py-4 rounded-lg lg:w-80 shadow-none">
			{children}
		</Card>
	);
};

type PanelContentProps = {
	children: React.ReactNode;
};

export const PanelContent = async ({ children }: PanelContentProps) => {
	return (
		<section className="grow flex items-center justify-center rounded-lg lg:w-64">
			{children}
		</section>
	);
};

type Props = {
	children: React.ReactNode;
};

const PanelLayout = ({ children }: Props) => {
	return (
		<div className="w-full flex flex-wrap items-start justify-start gap-4 mt-4">
			{children}
		</div>
	);
};

export default PanelLayout;
