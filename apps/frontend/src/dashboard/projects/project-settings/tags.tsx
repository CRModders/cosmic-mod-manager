import { ContentWrapperCard } from "@/src/settings/panel";

const TagsSettingsPage = () => {
	return (
		<ContentWrapperCard>
			<div className="w-full flex flex-col items-start justify-start gap-1">
				<h2 className="text-2xl font-semibold">Tags</h2>
				<p className=" text-foreground-muted">
					Accurate tagging is important to help people find your mod. Make sure to select all tags that apply.
				</p>
			</div>

			<div className="w-full flex flex-col items-start justify-start">
				<h2 className="text-lg font-semibold">Categories</h2>
				<p className=" text-foreground-muted">
					Select all categories that reflect the themes or function of your project.
				</p>
			</div>
		</ContentWrapperCard>
	);
};

export default TagsSettingsPage;
