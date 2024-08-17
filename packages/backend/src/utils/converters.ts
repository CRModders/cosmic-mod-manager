import { FileType } from "@shared/types";

export const getFileTypeFromString = (type: string): FileType | null => {
    switch (type.toLowerCase()) {
        case FileType.JAR:
            return FileType.JAR;
        case FileType.ZIP:
            return FileType.ZIP;
        case FileType.PNG:
            return FileType.PNG;
        case FileType.JPEG:
            return FileType.JPEG;
        default:
            return null;
    }
};
