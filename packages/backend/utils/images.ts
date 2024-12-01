import { FileType } from "@shared/types";
import sharp = require("sharp");

export async function resizeImageToWebp(file: File, inputFileType: FileType, width?: number, height?: number, resizeGifs = false) {
    if (!width && !height) {
        throw new Error("Either width or height must be provided to resize the image");
    }

    if (inputFileType === FileType.GIF && resizeGifs === false) {
        // GIFs loose animation when resized
        return file;
    }

    const imgBuffer = await file.arrayBuffer();
    const sharpInstance = sharp(imgBuffer);

    const resizedImgBuffer = await sharpInstance
        .webp()
        .resize({
            width: width,
            height: height,
        })
        .toArray();

    return new File(resizedImgBuffer, "__resized-webp-img__");
}

export async function getAverageColor(file: File) {
    try {
        const buffer = await file.arrayBuffer();
        const { data } = await sharp(buffer).resize(1, 1).raw().toBuffer({ resolveWithObject: true });

        const hexColor = rgbToHex(data[0], data[1], data[2]);
        return hexColor;
    } catch (err) {
        console.error("Error processing image: ", file.name, "\n", err);
        return null;
    }
}

function rgbToHex(r: number, g: number, b: number) {
    const hexCode = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return `#${hexCode}`;
}
