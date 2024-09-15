import { FileType } from "../../types";

const VALID_PRIMARY_FILE_TYPES = [FileType.JAR, FileType.ZIP];

export const isVersionPrimaryFileValid = (fileType: FileType | null) => {
    if (!fileType) return false;

    return VALID_PRIMARY_FILE_TYPES.includes(fileType);
};
