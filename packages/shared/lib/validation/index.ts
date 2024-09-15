import { FileType, ProjectType } from "../../types";
import { getProjectTypeFromString } from "../utils/convertors";

export const isVersionPrimaryFileValid = (fileType: FileType | null, projectType: string[]) => {
    if (!fileType) return false;

    const allowedFileTypes: FileType[] = [];
    for (const type of projectType) {
        const projectType = getProjectTypeFromString(type);
        if (projectType === ProjectType.MOD || projectType === ProjectType.PLUGIN) allowedFileTypes.push(FileType.JAR);

        if (
            projectType === ProjectType.SHADER ||
            projectType === ProjectType.RESOURCE_PACK ||
            projectType === ProjectType.MODPACK ||
            projectType === ProjectType.DATAPACK
        ) {
            allowedFileTypes.push(FileType.ZIP);
        }
    }

    return allowedFileTypes.includes(fileType);
};
