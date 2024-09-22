import { FileType } from "../../types";

const VALID_PRIMARY_FILE_TYPES = [FileType.JAR, FileType.ZIP, FileType.SEVEN_Z, FileType.GZ, FileType.TAR_GZ];

export const isVersionPrimaryFileValid = (fileType: FileType | null) => {
    if (!fileType) return false;

    return VALID_PRIMARY_FILE_TYPES.includes(fileType);
};

export const isImageFile = (fileType: FileType | null) => {
    if (!fileType) return false;
    const validImageTypes = [FileType.JPEG, FileType.PNG, FileType.WEBP];

    return validImageTypes.includes(fileType);
};
