import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import "@/src/globals.css";
import type React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import "./styles.css";

type SidePanelProps = {
	className?: string;
	children: React.ReactNode;
};

export const SidePanel = ({ children, className }: SidePanelProps) => {
	return (
		<Card className={cn("w-full lg:w-80 px-4 py-4 rounded-lg shadow-none border border-border", className)}>
			{children}
		</Card>
	);
};

type PanelContentProps = {
	className?: string;
	children: React.ReactNode;
};

export const PanelContent = ({ children, className }: PanelContentProps) => {
	return (
		<section
			className={cn("grow max-w-full flex flex-col gap-4 items-center justify-center rounded-lg lg:w-64", className)}
		>
			{children}
		</section>
	);
};

type Props = {
	children: React.ReactNode;
};

export const PanelLayout = ({ children }: Props) => {
	return (
		<div className="w-full flex flex-wrap items-start justify-start gap-x-4 gap-y-3 mt-4 relative">{children}</div>
	);
};

type SidePanelLinkProps = {
	href: string;
	label: string;
	icon?: React.JSX.Element;
};

export const SidepanelLink = ({ href, icon, label }: SidePanelLinkProps) => {
	return (
		<li className="w-full rounded-lg group">
			<RouterNavLink
				to={href}
				aria-label={label}
				className="bg_stagger_animation sidePanelLink group w-full px-4 py-2 relative flex items-center justify-start gap-1 rounded-lg overflow-hidden"
			>
				<div className="hidden activeLinkIndicator absolute top-[50%] left-0 translate-y-[-50%] h-full w-[0.25rem] bg-accent-bg" />

				<i className="text_stagger_animation linkIcon text-foreground/60 group-hover:text-foreground/60 hover:text-foreground/60 w-6 flex items-center justify-start">
					{icon}
				</i>
				<span className="text_stagger_animation linkLabel font-semibold text-foreground-muted group-hover:text-foreground">
					{label}
				</span>
			</RouterNavLink>
		</li>
	);
};

export const ContentWrapperCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
	return (
		<Card className={cn("w-full flex flex-col items-start justify-center px-5 py-4 gap-4 rounded-lg", className)}>
			{children}
		</Card>
	);
};
