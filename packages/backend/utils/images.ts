import { FileType } from "@shared/types";
import sharp = require("sharp");

export async function resizeImageToWebp(file: File, inputFileType: FileType, width?: number, height?: number) {
    if (!width && !height) {
        throw new Error("Either width or height must be provided to resize the image");
    }

    if (inputFileType === FileType.GIF) {
        // GIFs loose animation when resized
        return file;
    }

    const imgBuffer = await file.arrayBuffer();
    const sharpInstance = await sharp(imgBuffer);

    const resizedImgBuffer = await sharpInstance
        .webp()
        .resize({
            width: width,
            height: height,
        })
        .toArray();

    return new File(resizedImgBuffer, "__resized-webp-img__");
}
