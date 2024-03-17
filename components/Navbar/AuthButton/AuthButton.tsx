import React from "react";
import LoginBtn from "./LoginBtn";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import SignOutBtn from "./SignOutBtn";

const AuthButton = async () => {
	const session = await auth().catch((e) => console.log(e));

	if (session?.user?.email) {
		return (
			<Popover>
				<PopoverTrigger asChild>
					<Button
						size="icon"
						variant="ghost"
						className="hover:bg-background_hover dark:hover:bg-background_hover_dark rounded-[50%]"
					>
						<div className="flex items-center justify-center p-1">
							<Avatar>
								{session?.user?.image && (
									<AvatarImage
										src={session?.user?.image}
										alt={`${session?.user?.name} `}
									/>
								)}
								<AvatarFallback className="bg-background_hover dark:bg-background_hover_dark h-12 w-12">
									{session?.user?.name?.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="w-full flex flex-col items-center justify-center gap-4">
						<div className="w-full flex flex-col items-start justify-center">
							<p className="text-lg font-semibold">{session?.user?.name}</p>
							<p>{session?.user?.email}</p>
						</div>
						<div className="w-full h-[0.1rem] bg-background_hover dark:bg-background_hover_dark" />
						<div className="w-full">
							<SignOutBtn />
						</div>
					</div>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<div className="flex items-center justify-center">
			<LoginBtn />
		</div>
	);
};

// Mobile NavMenu Profile button
export const MenuAuthButton = async () => {
	const session = await auth().catch((e) => console.log(e));

	if (session?.user?.email) {
		return (
			<Link
				href="/profile"
				className="w-full flex gap-4 py-2 items-center justify-center p-1"
			>
				<Avatar>
					{session?.user?.image && (
						<AvatarImage
							src={session?.user?.image}
							alt={`${session?.user?.name} `}
						/>
					)}

					<AvatarFallback className="bg-background_hover dark:bg-background_hover_dark h-12 w-12">
						{session?.user?.name?.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>

				<p className="text-lg">{session?.user?.name}</p>
			</Link>
		);
	}

	return (
		<div className="w-full flex items-center justify-center">
			<LoginBtn />
		</div>
	);
};

export default AuthButton;
