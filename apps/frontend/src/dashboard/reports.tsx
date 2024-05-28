import { ContentWrapperCard } from "../settings/panel";

const ReportsPage = () => {
	return (
		<div className="w-full flex flex-col items-center justify-center gap-4">
			{/* Profile overview */}
			<ContentWrapperCard>
				<h1 className="w-full flex items-center justify-start font-semibold text-2xl text-foreground-muted">Reports</h1>
				<div className="w-full flex">
					<p>You don't have any active reports.</p>
				</div>
			</ContentWrapperCard>
		</div>
	);
};

export default ReportsPage;
