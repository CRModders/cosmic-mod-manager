import { UploadIcon } from "@/components/icons";
import ReleaseChannelIndicator from "@/components/release-channel-pill";
import { Button } from "@/components/ui/button";
import { useIsUseAProjectMember } from "@/src/hooks/project-member";
import { Projectcontext } from "@/src/providers/project-context";
import { ContentWrapperCard } from "@/src/settings/panel";
import { DownloadIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { CapitalizeAndFormatString, createURLSafeSlug, formatDate } from "@root/lib/utils";
import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const VersionListPage = ({ projectType }: { projectType: string }) => {
	const isAProjectMember = useIsUseAProjectMember();
	const { projectData } = useContext(Projectcontext);
	const { projectUrlSlug } = useParams();

	return (
		<div className="w-full flex flex-col gap-4 items-start justify-center">
			{isAProjectMember === true && (
				<ContentWrapperCard>
					<div className="w-full flex gap-4 items-center justify-start">
						<Link to={`/${createURLSafeSlug(projectData?.type || "").value}/${projectData?.url_slug}/version/create`}>
							<Button className="dark:text-foreground gap-2 bg-accent-bg hover:bg-accent-bg/85" tabIndex={-1}>
								<UploadIcon strokeWidth={2} className="w-4 h-4" />
								<span className="font-semibold">Upload a version</span>
							</Button>
						</Link>
						<div className="text-foreground-muted flex gap-2 items-center justify-start">
							<InfoCircledIcon className="w-4 h-4" /> <p>Click to choose a file or drag one onto this input</p>
						</div>
					</div>
				</ContentWrapperCard>
			)}

			<AllProjectVersionsList projectUrlSlug={projectUrlSlug || ""} projectType={projectType} />
		</div>
	);
};

export default VersionListPage;

const AllProjectVersionsList = ({ projectType, projectUrlSlug }: { projectType: string; projectUrlSlug: string }) => {
	const { allProjectVersions } = useContext(Projectcontext);
	const navigate = useNavigate();

	const redirectToVersionpage = (versionUrl: string) => {
		navigate(`/${projectType}/${projectUrlSlug}/version/${versionUrl}`);
	};

	if (!allProjectVersions?.versions.length) {
		return null;
	}

	return (
		<ContentWrapperCard>
			<div className="w-full flex flex-col">
				<div className="w-full flex flex-col p-2">
					<div className="w-full flex flex-wrap p-2 pb-4">
						<p className="font-semibold text-foreground text-lg overflow-hidden w-[40%]">
							<span className="ml-14">Version</span>
						</p>
						<p className="font-semibold text-foreground text-lg overflow-hidden w-[30%]">Supports</p>
						<p className="font-semibold text-foreground text-lg overflow-hidden w-[30%]">Stats</p>
					</div>
					{allProjectVersions?.versions.map((version) => {
						return (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<div
								className="w-full flex flex-wrap p-3 rounded-lg cursor-pointer hover:bg-bg-hover"
								key={version.id}
								onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
									// @ts-expect-error
									if (!e.target.closest(".versionFileDownloadButton") && !e.target.closest(".versionPageLink")) {
										redirectToVersionpage(version.url_slug);
									}
								}}
							>
								<div className="flex gap-4 w-[40%]">
									<a
										href={`/api/file/${encodeURIComponent(version.files[0].file_url)}`}
										className="versionFileDownloadButton flex h-fit items-center justify-center"
									>
										<Button
											className="h-fit w-fit p-2 bg-accent-bg hover:bg-accent-bg/85 dark:text-foreground font-semibold gap-2"
											size={"icon"}
											tabIndex={-1}
										>
											<DownloadIcon className="w-5 h-5" />
										</Button>
									</a>
									<div className="h-full flex flex-col items-start justify-center">
										<Link
											to={`/${projectType}/${projectUrlSlug}/version/${version.url_slug}`}
											className="versionPageLink"
										>
											<p className="leading-snug text-lg font-semibold text-foreground-muted">
												{version.version_title}
											</p>
										</Link>
										<div className="w-full flex items-center justify-start gap-x-2 gap-y-1">
											<ReleaseChannelIndicator release_channel={version.release_channel} labelClassName="text-base" />
											<p className="text-foreground-muted">{version.version_number}</p>
										</div>
									</div>
								</div>
								<div className="w-[30%] flex flex-col items-start justify-start text-foreground-muted">
									<p>{version.supported_loaders.map((loader) => CapitalizeAndFormatString(loader)).join(", ")}</p>
									<p>
										{version.supported_game_versions
											.map((gameVersion) => CapitalizeAndFormatString(gameVersion))
											.join(", ")}
									</p>
								</div>
								<div className="w-[30%]">
									<p className="text-foreground-muted">
										Published on{" "}
										<span className="font-semibold">
											{formatDate(new Date(version.published_on), "${month} ${day}, ${year}")}
										</span>
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</ContentWrapperCard>
	);
};
