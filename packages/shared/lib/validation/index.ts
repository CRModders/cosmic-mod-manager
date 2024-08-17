import { FileType, ProjectType } from "../../types";
import { getProjectTypeFromString } from "../utils/convertors";

export const isVersionPrimaryFileValid = (fileType: FileType | null, projectType: string[]) => {
    if (!fileType) return false;

    const allowedFileTypes: FileType[] = [];
    for (let type of projectType) {
        type = getProjectTypeFromString(type);
        if (type === ProjectType.MOD || type === ProjectType.PLUGIN) allowedFileTypes.push(FileType.JAR);
        if (
            type === ProjectType.SHADER ||
            type === ProjectType.RESOURCE_PACK ||
            type === ProjectType.MODPACK ||
            type === ProjectType.DATAPACK
        ) {
            allowedFileTypes.push(FileType.ZIP);
        }
    }

    return allowedFileTypes.includes(fileType);
};
