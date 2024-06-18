import { cn } from "@/lib/utils";
import { useEffect } from "react";
import "./styles.css";

export const Spinner = ({ size = "1.8rem", className }: { size?: string; className?: string }) => {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			className={cn("animate-spin ease-linear duration-700 text-foreground", className)}
			viewBox="0 0 64 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
		>
			<path
				d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
				stroke="currentColor"
				className="text-bg-hover"
				strokeWidth="5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
				stroke="currentColor"
				strokeWidth="5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="currentColor"
			/>
		</svg>
	);
};

type CubeLoaderSize = "xs" | "sm" | "default" | "lg" | "xl" | "2xl";

export function CubeLoader({ size }: { size?: CubeLoaderSize }) {
	let cubeSize = "1.25rem";

	switch (size) {
		case "xs":
			cubeSize = "0.8rem";
			break;
		case "sm":
			cubeSize = "1rem";
			break;
		case "lg":
			cubeSize = "1.75rem";
			break;
		case "xl":
			cubeSize = "2.5rem";
			break;
		case "2xl":
			cubeSize = "3.5rem";
			break;
		default:
			cubeSize = "1.25rem";
			break;
	}

	return (
		<div className="w-full grid place-items-center relative">
			<div
				className="scene"
				// @ts-expect-error
				style={{ "--size": cubeSize }}
			>
				<div className="cube-wrapper">
					<div className="cube">
						<div className="cube-faces">
							<div className="cube-face shadow" />
							<div className="cube-face bottom" />
							<div className="cube-face top" />
							<div className="cube-face left" />
							<div className="cube-face right" />
							<div className="cube-face back" />
							<div className="cube-face front" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export const AbsolutePositionedSpinner = ({
	size,
	className,
	preventScroll = false,
}: { size?: CubeLoaderSize; className?: string; preventScroll?: boolean }) => {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (preventScroll !== true) return;

		document.body.classList.add("no-scrollbar");

		return () => {
			document.body.classList.remove("no-scrollbar");
		};
	}, []);

	return (
		<div
			className={cn(
				"absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center",
				className,
			)}
		>
			<div className="w-full h-full flex items-center justify-center relative rounded-xl">
				<div className="w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background opacity-60" />
				<CubeLoader size={size} />
			</div>
		</div>
	);
};

export const DotsLoader = ({ className }: { className?: string }) => {
	return <div className={cn("dots-loader w-10", className)} />;
};

export const SuspenseFallback = () => {
	return (
		<div className="w-full flex items-center justify-center py-12">
			<DotsLoader />
		</div>
	);
};
