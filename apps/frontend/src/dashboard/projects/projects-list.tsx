import CopyBtn from "@/components/copy-btn";
import { GearIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CubeIcon } from "@radix-ui/react-icons";
import { createURLSafeSlug } from "@root/lib/utils";
import { Link } from "react-router-dom";
import type { ProjectData } from "./projects";

export default function ProjectListTable({ projectsList }: { projectsList: ProjectData[] }) {
	return (
		<div className="w-full px-4 border border-border-hicontrast/50 rounded-lg mt-6">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="overflow-hidden w-[10%]">Icon</TableHead>
						<TableHead className="overflow-hidden w-[25%]">Name</TableHead>
						<TableHead className="overflow-hidden w-[25%]">ID</TableHead>
						<TableHead className="overflow-hidden w-[12%]">Type</TableHead>
						<TableHead className="overflow-hidden w-[12%]">Status</TableHead>
						<TableHead className="overflow-hidden w-[5%]"> </TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{projectsList.map((project) => {
						return (
							<TableRow key={project.id}>
								<TableCell>
									<Link
										to={`/${createURLSafeSlug(project.type).value}/${project.url_slug}`}
										className="flex w-fit h-full aspect-square p-2 rounded-lg bg-background-shallow"
									>
										<CubeIcon className="w-8 h-8 text-foreground-muted" />
									</Link>
								</TableCell>
								<TableCell>
									<Link to={`/${createURLSafeSlug(project.type).value}/${project.url_slug}`}>
										<Button variant={"link"}>{project.name}</Button>
									</Link>
								</TableCell>
								<TableCell>
									<div className="w-fit flex items-center justify-start gap-2 rounded pl-2 pr-1">
										<CopyBtn text={project.id} label={`...${project.id.slice(project.id.length - 10)}`} />
									</div>
								</TableCell>
								<TableCell>{project.type}</TableCell>
								<TableCell>{project.status}</TableCell>
								<TableCell>
									<Link
										to={`/${createURLSafeSlug(project.type).value}/${project.url_slug}/settings`}
										className="flex items-center justify-center h-full w-fit text-foreground-muted"
									>
										<GearIcon size="2.25rem" className="hover:bg-bg-hover rounded-lg p-2" />
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
