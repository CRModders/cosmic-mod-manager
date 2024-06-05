import { UploadIcon } from "@/components/icons";
import ReleaseChannelIndicator from "@/components/release-channel-pill";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
					<div className="w-full flex flex-wrap gap-4 items-center justify-start">
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

	return (
		<div className="w-full flex items-center justify-center" id="all-versions">
			{allProjectVersions?.versions.length ? (
				<ContentWrapperCard>
					<div className="w-full flex items-center justify-center">
						<Table>
							<TableHeader className="align-top pb-4 h-16">
								<TableRow className="border-none">
									<TableHead className="overflow-hidden min-w-16 w-[5%] font-semibold text-foreground text-lg">
										{" "}
									</TableHead>
									<TableHead className="overflow-hidden min-w-48 w-[35%] font-semibold text-foreground text-lg">
										Version
									</TableHead>
									<TableHead className="overflow-hidden min-w-36 w-[35%] font-semibold text-foreground text-lg">
										Supports
									</TableHead>
									<TableHead className="overflow-hidden min-w-36 w-[25%] font-semibold text-foreground text-lg">
										Stats
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{allProjectVersions?.versions.map((version) => {
									return (
										<TableRow
											key={version.id}
											className="cursor-pointer hover:bg-bg-hover"
											onClick={(e) => {
												// @ts-expect-error
												if (!e.target.closest(".noClickRedirect")) {
													navigate(`/${projectType}/${projectUrlSlug}/version/${version.url_slug}`);
												}
											}}
										>
											<TableCell className="align-top">
												<div className="flex items-start justify-center py-1.5">
													<a
														href={`/api/file/${encodeURIComponent(version.files[0].file_url)}`}
														className="noClickRedirect flex h-fit items-center justify-center"
													>
														<Button
															className="h-fit w-fit p-2 bg-accent-bg hover:bg-accent-bg/85 dark:text-foreground font-semibold gap-2"
															size={"icon"}
															tabIndex={-1}
														>
															<DownloadIcon className="w-5 h-5" />
														</Button>
													</a>
												</div>
											</TableCell>
											<TableCell className="align-top">
												<div className="w-full flex flex-col items-start justify-start">
													<Link
														to={`/${projectType}/${projectUrlSlug}/version/${version.url_slug}`}
														className="noClickRedirect"
													>
														<p className="leading-snug text-lg font-semibold text-foreground-muted">
															{version.version_title}
														</p>
													</Link>
													<div className="w-full flex items-start justify-start gap-x-2 gap-y-1">
														<ReleaseChannelIndicator
															release_channel={version.release_channel}
															labelClassName="text-base"
														/>
														<p className="text-foreground-muted">{version.version_number}</p>
													</div>
												</div>
											</TableCell>
											<TableCell className="align-top">
												<div className="flex flex-col items-start justify-start">
													<p>
														{version.supported_loaders.map((loader) => CapitalizeAndFormatString(loader)).join(", ")}
													</p>
													<p>
														{version.supported_game_versions
															.map((gameVersion) => CapitalizeAndFormatString(gameVersion))
															.join(", ")}
													</p>
												</div>
											</TableCell>
											<TableCell className="align-top">
												<div className="flex items-start justify-start">
													<p className="text-foreground-muted">
														Published on{" "}
														<span className="font-semibold">
															{formatDate(new Date(version.published_on), "${month} ${day}, ${year}")}
														</span>
													</p>
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</ContentWrapperCard>
			) : null}
		</div>
	);
};
