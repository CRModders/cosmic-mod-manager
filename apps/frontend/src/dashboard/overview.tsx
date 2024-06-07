import { ChevronRightIcon, HistoryIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/auth-provider";
import { ContentWrapperCard } from "../settings/panel";
const Overview = () => {
	const { session } = useContext(AuthContext);

	return (
		<div className="w-full flex flex-col items-center justify-center gap-4">
			<Helmet>
				<title>Dashboard | CRMM</title>
				<meta name="description" content="Your dashboard." />
			</Helmet>

			{/* Profile overview */}
			<ContentWrapperCard>
				<div className="w-full flex flex-col items-center justify-center my-2">
					<div className="w-full flex flex-wrap items-center justify-start gap-6">
						<div className="flex grow sm:grow-0 items-center justify-center">
							{session?.avatar_image ? (
								<img
									src={session?.avatar_image}
									alt={`${session?.user_name} `}
									className="h-24 aspect-square rounded-full bg-bg-hover"
								/>
							) : (
								<span>{session?.name[0]}</span>
							)}
						</div>
						<div className="grow max-w-full flex flex-col items-start justify-center">
							<h1 className="flex w-full items-center sm:justify-start justify-center text-4xl font-semibold text-foreground-muted">
								{session?.user_name}
							</h1>
							<div className="w-full flex items-center sm:justify-start justify-center ">
								<Link
									to={"/settings/account"}
									className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 mt-2"
								>
									View your profile <ChevronRightIcon size="1rem" />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</ContentWrapperCard>

			{/* Notifications */}
			<div className="w-full flex flex-wrap items-start justify-start gap-4">
				<ContentWrapperCard className="w-fit grow shrink flex">
					<h1 className="w-full flex items-center justify-start font-semibold text-2xl text-foreground-muted">
						Notifications
					</h1>
					<div className="w-full flex flex-col">
						<p>You have no unread notifications.</p>
						<Button
							className="w-fit mt-2 flex items-center justify-center gap-2 text-base text-foreground-muted"
							variant={"secondary"}
						>
							<HistoryIcon size="1.25rem" />
							View notification history
						</Button>
					</div>
				</ContentWrapperCard>

				<ContentWrapperCard className="shrink-0 w-full sm:w-64 flex flex-col gap-4">
					<h1 className="w-full flex items-center justify-start font-semibold text-2xl text-foreground-muted">
						Analytics
					</h1>

					<div className="w-full flex flex-wrap gap-4">
						<div className="w-fit grow shrink flex flex-wrap items-center justify-center px-5 py-4 rounded-lg bg-bg-hover">
							<div className="w-full flex flex-col gap-2">
								<h2 className="text-foreground-muted font-semibold text-lg">Total downloads</h2>
								<span className="text-foreground font-semibold text-4xl mt-1">43,675</span>
								<span className="text-foreground-muted">from 4 projects</span>
							</div>
						</div>

						<div className="w-fit grow shrink flex flex-wrap items-center justify-center px-5 py-4 rounded-lg bg-bg-hover">
							<div className="w-full flex flex-col gap-2">
								<h2 className="text-foreground-muted font-semibold text-lg">Total followers</h2>
								<span className="text-foreground font-semibold text-4xl mt-1">5,624</span>
								<span className="text-foreground-muted">from 4 projects</span>
							</div>
						</div>
					</div>
				</ContentWrapperCard>
			</div>
		</div>
	);
};

export default Overview;
