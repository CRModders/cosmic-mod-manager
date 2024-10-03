import { fallbackProjectIcon } from "@/components/icons";
import { ImgWrapper } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import ComboBox from "@/components/ui/combobox";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { VariantButtonLink } from "@/components/ui/link";
import { ReleaseChannelBadge } from "@/components/ui/release-channel-pill";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, getProjectPagePathname, getProjectVersionPagePathname, imageUrl, isCurrLinkActive } from "@/lib/utils";
import { projectContext } from "@/src/contexts/curr-project";
import { Tooltip } from "@radix-ui/react-tooltip";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getGameVersionFromValue, getGameVersionsFromValues } from "@shared/config/game-versions";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import { VersionReleaseChannel } from "@shared/types";
import type { ProjectDetailsData, ProjectVersionData } from "@shared/types/api";
import { ChevronsUpDownIcon, DownloadIcon, Gamepad2Icon, InfoIcon, WrenchIcon } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const getVersionData = (gameVersion: string, loader: string, versionsList: ProjectVersionData[]): ProjectVersionData | null => {
    let latestVersion = null;

    if (!gameVersion) {
        for (const version of versionsList) {
            if (version.loaders.includes(loader)) {
                if (!latestVersion) break;
                latestVersion = version;
            }
        }
    } else {
        for (const version of versionsList) {
            if (version.gameVersions.includes(gameVersion)) {
                if (!latestVersion) latestVersion = version;
                if (version.loaders.includes(loader)) return version;
            }
        }
    }
    return latestVersion;
};

const InteractiveDownloadPopup = () => {
    const { projectData, allProjectVersions } = useContext(projectContext);
    const [selectedGameVersion, setSelectedGameVersion] = useState<string>(projectData?.gameVersions[0] || "");
    const [selectedLoader, setSelectedLoader] = useState<string>(projectData?.loaders[0] || "");
    const location = useLocation();

    const gameVersionsList = useMemo(() => {
        if (!projectData || !allProjectVersions) return [];

        const list = [];
        for (const gameVersion of getGameVersionsFromValues(projectData.gameVersions)) {
            const projectVersion = getVersionData(gameVersion.value, selectedLoader, allProjectVersions);

            if (!projectVersion) continue;
            if (!selectedLoader) {
                list.push({ label: gameVersion.label, value: gameVersion.value });
                continue;
            }
            list.push({
                label: gameVersion.label,
                value: gameVersion.value,
                disabled: !projectVersion.loaders.includes(selectedLoader),
                disabledReason: `${projectData.name} does not support ${gameVersion.label} for ${CapitalizeAndFormatString(selectedLoader)}`,
            });
        }
        return list;
    }, [projectData, selectedLoader, allProjectVersions]);

    const loadersList = useMemo(() => {
        if (!projectData || !allProjectVersions) return [];
        if (!selectedGameVersion)
            return projectData.loaders.map((loader) => ({ label: CapitalizeAndFormatString(loader) || "", value: loader }));

        const list = [];
        for (const loader of projectData.loaders) {
            const projectVersion = getVersionData(selectedGameVersion, loader, allProjectVersions);

            if (!projectVersion) continue;
            if (!selectedGameVersion) {
                list.push({ label: CapitalizeAndFormatString(loader) || "", value: loader });
                continue;
            }
            list.push({
                label: CapitalizeAndFormatString(loader) || "",
                value: loader,
                disabled: !projectVersion.loaders.includes(loader),
                disabledReason: `${projectData.name} does not support ${CapitalizeAndFormatString(loader)} for ${getGameVersionFromValue(selectedGameVersion)?.label}`,
            });
        }
        return list;
    }, [projectData, selectedGameVersion, allProjectVersions]);

    if (!projectData || !allProjectVersions) return null;
    const isVersionDetailsPage = isCurrLinkActive(
        getProjectPagePathname(projectData.type[0], projectData.slug, "/version/"),
        location.pathname,
        false,
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={isVersionDetailsPage ? "secondary-inverted" : "default"}>
                    <DownloadIcon className="w-btn-icon-md h-btn-icon-md" />
                    Download
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="flex flex-row gap-3 items-center justify-start pb-3">
                    <ImgWrapper
                        src={imageUrl(projectData.icon)}
                        alt={projectData.name}
                        className="h-9 w-9 rounded-md"
                        fallback={fallbackProjectIcon}
                    />
                    <DialogTitle>Download {projectData.name}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Downlad iris</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <DialogBody className="flex flex-col items-center justify-center gap-3">
                    <ComboBox options={gameVersionsList} value={selectedGameVersion} setValue={setSelectedGameVersion}>
                        <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between text-extra-muted-foreground"
                            disabled={projectData.gameVersions.length < 2}
                        >
                            <span className="flex items-center justify-start gap-2 font-medium">
                                <Gamepad2Icon className="w-btn-icon-md h-btn-icon-md" />
                                <span className="text-muted-foreground">
                                    {selectedGameVersion ? (
                                        <>
                                            Game version:{" "}
                                            <em className="not-italic text-foreground/90">
                                                {getGameVersionFromValue(selectedGameVersion)?.label}
                                            </em>
                                        </>
                                    ) : (
                                        <>Select game version</>
                                    )}
                                </span>
                            </span>
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
                        </Button>
                    </ComboBox>

                    {(projectData.loaders?.length || 0) > 1 ? (
                        <ComboBox options={loadersList} value={selectedLoader} setValue={setSelectedLoader}>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between text-extra-muted-foreground"
                                disabled={projectData.loaders.length < 2}
                            >
                                <span className="flex items-center justify-start gap-2 font-medium">
                                    <WrenchIcon className="w-btn-icon-md h-btn-icon-md" />
                                    <span className="text-muted-foreground">
                                        {selectedLoader ? (
                                            <>
                                                Platform:{" "}
                                                <em className="not-italic text-foreground/90">
                                                    {CapitalizeAndFormatString(selectedLoader)}
                                                </em>
                                            </>
                                        ) : (
                                            <>Select platform</>
                                        )}
                                    </span>
                                </span>
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
                            </Button>
                        </ComboBox>
                    ) : (
                        (projectData.loaders?.length || 0) === 1 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                buttonVariants({ variant: "outline" }),
                                                "w-full flex items-center justify-between text-extra-muted-foreground hover:bg-transparent cursor-not-allowed opacity-50",
                                            )}
                                        >
                                            <span className="flex items-center justify-start gap-2 font-medium">
                                                <WrenchIcon className="w-btn-icon-md h-btn-icon-md" />
                                                <span className="text-muted-foreground">
                                                    {selectedLoader ? (
                                                        <>
                                                            Platform:{" "}
                                                            <em className="not-italic text-foreground/90">
                                                                {CapitalizeAndFormatString(selectedLoader)}
                                                            </em>
                                                        </>
                                                    ) : (
                                                        <>Select platform</>
                                                    )}
                                                </span>
                                            </span>
                                            <InfoIcon className="ml-2 h-4 w-4 shrink-0" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {projectData.name} is only available for {CapitalizeAndFormatString(projectData.loaders[0])}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )
                    )}
                    {selectedGameVersion && (selectedLoader || !loadersList.length) ? (
                        <AvailableVersionsList
                            selectedGameVersion={selectedGameVersion}
                            selectedLoader={selectedLoader}
                            allProjectVersions={allProjectVersions}
                            projedata={projectData}
                        />
                    ) : null}
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};

export default InteractiveDownloadPopup;

interface AvailableVersionsListProps {
    selectedGameVersion: string;
    selectedLoader: string | null;
    allProjectVersions: ProjectVersionData[];
    projedata: ProjectDetailsData;
}

const AvailableVersionsList = ({ selectedGameVersion, selectedLoader, allProjectVersions, projedata }: AvailableVersionsListProps) => {
    const versionsList = useMemo(() => {
        if (!projedata || !allProjectVersions) return [];
        const list: ProjectVersionData[] = [];
        for (const version of allProjectVersions) {
            if (version.gameVersions.includes(selectedGameVersion) && (!selectedLoader || version.loaders.includes(selectedLoader))) {
                const lastItem = list[list.length - 1];
                if (lastItem && lastItem.releaseChannel === VersionReleaseChannel.RELEASE) break;
                list.push(version);
            }
        }
        return list;
    }, [selectedGameVersion, selectedLoader, allProjectVersions, projedata]);

    if (!versionsList.length)
        return (
            <span className="w-full flex items-center justify-start py-3 px-1 italic text-extra-muted-foreground">
                No versions available for {getGameVersionFromValue(selectedGameVersion)?.label} on{" "}
                {CapitalizeAndFormatString(selectedLoader)}
            </span>
        );

    return (
        <div className="w-full flex flex-col items-center justify-center gap-3">
            {versionsList.map((version) => {
                return (
                    <div key={version.id} className="w-full flex items-center justify-between gap-x-4 gap-y-2 bg-background p-2 rounded-lg">
                        <div className="flex gap-3 items-center justify-start">
                            <ReleaseChannelBadge releaseChannel={version.releaseChannel} />
                            <div className="flex flex-col items-start justify-center gap-1">
                                <DialogClose asChild>
                                    <Link
                                        to={getProjectVersionPagePathname(projedata.type[0], projedata.slug, version.slug)}
                                        className="font-bold text-foreground leading-none"
                                    >
                                        {version.versionNumber}
                                    </Link>
                                </DialogClose>
                                <span className="text-sm font-medium text-muted-foreground/85 leading-none">{version.title}</span>
                            </div>
                        </div>

                        <VariantButtonLink
                            url={version.primaryFile?.url || ""}
                            size={"icon"}
                            variant="default"
                            className="shrink-0"
                            label={`download ${version.title}`}
                        >
                            <DownloadIcon className="w-btn-icon-md h-btn-icon-md" />
                        </VariantButtonLink>
                    </div>
                );
            })}
        </div>
    );
};
