import { trimWhitespaces } from ".";
import { FileType } from "../../types";

const strCharsPerByte = 2;
const magicNumberLen = 32;

interface Signature {
    offset: number;
    signature: string;
}

interface FileSignatureListItem {
    signature: Signature[];
    types: FileType[];
}

const fileTypeSignaturesList: FileSignatureListItem[] = [
    {
        signature: [{ offset: 0, signature: "50 4B 03 04" }],
        types: [FileType.JAR, FileType.ZIP],
    },
    {
        signature: [{ offset: 0, signature: "50 4B 05 06" }],
        types: [FileType.JAR, FileType.ZIP],
    },
    {
        signature: [{ offset: 0, signature: "50 4B 07 08" }],
        types: [FileType.JAR, FileType.ZIP],
    },
    {
        signature: [{ offset: 0, signature: "50 4B 53 70" }],
        types: [FileType.JAR, FileType.ZIP],
    },
    {
        signature: [{ offset: 0, signature: "37 7A BC AF 27 1C" }],
        types: [FileType.SEVEN_Z]
    },
    {
        signature: [{offset: 0, signature: "1F 8B"}],
        types: [FileType.GZ, FileType.TAR_GZ]
    },
    {
        signature: [{ offset: 0, signature: "89 50 4E 47 0D 0A 1A 0A" }],
        types: [FileType.PNG],
    },
    {
        signature: [
            { offset: 0, signature: "52 49 46 46" },
            { offset: 8, signature: "57 45 42 50" },
        ],
        types: [FileType.WEBP],
    },
    {
        signature: [{ offset: 0, signature: "FF D8 FF" }],
        types: [FileType.JPEG],
    },
];

const getFilesTypeFromSignature = (fileSignature: string) => {
    for (const fileTypeSignatureItem of fileTypeSignaturesList) {
        let matches = true;

        for (const sign of fileTypeSignatureItem.signature) {
            const formattedSignature = trimWhitespaces(sign.signature);
            const formattedFileSignature = trimWhitespaces(fileSignature)
                .toUpperCase()
                .slice(sign.offset * strCharsPerByte);

            if (!formattedFileSignature.startsWith(formattedSignature)) {
                matches = false;
                break;
            }
        }

        if (matches) {
            return fileTypeSignatureItem.types;
        }
    }

    return null;
};

const intToHex = (int: number) => {
    return int.toString(16).padStart(2, "0");
};

const intArrayToHexArray = (array: Uint8Array) => {
    const hexArray: string[] = new Array(array.length);
    for (let i = 0; i < array.length; i++) {
        hexArray[i] = intToHex(array[i]);
    }

    return hexArray;
};

export const getTypeOfFile = async (file: File) => {
    const fileBuffer = await file.arrayBuffer();
    const array = new Uint8Array(fileBuffer.slice(0, magicNumberLen));

    const signature = intArrayToHexArray(array).join(" ");

    return getFilesTypeFromSignature(signature);
};
