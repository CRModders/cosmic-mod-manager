import CopyBtn from "@/components/copy-btn";
import { GearIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormatProjectTypes } from "@/lib/utils";
import { CubeIcon } from "@radix-ui/react-icons";
import { CapitalizeAndFormatString, createURLSafeSlug } from "@root/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import type { ProjectData } from "./projects";

export default function ProjectListTable({ projectsList }: { projectsList: ProjectData[] }) {
	const navigate = useNavigate();

	return (
		<div className="w-full px-4 border border-border-hicontrast/50 rounded-lg mt-6 py-2">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="overflow-hidden w-[10%]">Icon</TableHead>
						<TableHead className="overflow-hidden w-[30%]">Name</TableHead>
						<TableHead className="overflow-hidden w-[20%]">ID</TableHead>
						<TableHead className="overflow-hidden w-[20%]">Type</TableHead>
						<TableHead className="overflow-hidden w-[14%]">Status</TableHead>
						<TableHead className="overflow-hidden w-[6%]"> </TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{projectsList.map((project) => {
						return (
							<TableRow
								key={project.id}
								className=" hover:bg-bg-hover cursor-pointer"
								onClick={(e) => {
									//@ts-expect-error
									if (!e.target.closest(".noClickRedirect")) {
										navigate(`/${createURLSafeSlug(project.type[0]).value}/${project.url_slug}`);
									}
								}}
							>
								<TableCell>
									<Link
										to={`/${createURLSafeSlug(project.type[0]).value}/${project.url_slug}`}
										className="noClickRedirect flex w-fit h-full aspect-square p-2 rounded-lg bg-background-shallow"
									>
										<CubeIcon className="w-8 h-8 text-foreground-muted" />
									</Link>
								</TableCell>
								<TableCell>
									<Link
										to={`/${createURLSafeSlug(project.type[0]).value}/${project.url_slug}`}
										className="noClickRedirect"
									>
										<Button variant={"link"} className="p-0">
											{project.name}
										</Button>
									</Link>
								</TableCell>
								<TableCell className="cursor-default">
									<div className="noClickRedirect w-fit flex items-center justify-start gap-2 rounded">
										<CopyBtn
											text={project.id}
											label={`...${project.id.slice(project.id.length - 10)}`}
											className="px-2 py-1 hover:bg-background"
											iconClassName="w-4 h-4"
										/>
									</div>
								</TableCell>
								<TableCell>{FormatProjectTypes(project.type)}</TableCell>
								<TableCell>{CapitalizeAndFormatString(project.status)}</TableCell>
								<TableCell className="cursor-default">
									<Link
										to={`/${createURLSafeSlug(project.type[0]).value}/${project.url_slug}/settings`}
										className="noClickRedirect flex items-center justify-center h-full w-fit text-foreground-muted"
									>
										<GearIcon size="2.25rem" className="hover:bg-background rounded-lg p-2" />
									</Link>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
