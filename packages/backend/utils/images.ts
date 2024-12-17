import { FileType } from "@shared/types";
import sharp = require("sharp");

interface ResizeProps {
    width?: number;
    height?: number;
    resizeGifs?: boolean;
    fit?: keyof sharp.FitEnum;
    kernel?: keyof sharp.KernelEnum;
    withoutEnlargement?: sharp.ResizeOptions["withoutEnlargement"];
}

export async function resizeImageToWebp(file: File, inputFileType: FileType, props: ResizeProps): Promise<[File, FileType]> {
    let defaultKernel: ResizeProps["kernel"] = sharp.kernel.nearest;
    // Don't use nearest neighbor for large images
    if (file.size >= 512) defaultKernel = sharp.kernel.lanczos3;

    const kernel: ResizeProps["kernel"] = props.kernel || defaultKernel;
    if (!props.width && !props.height) {
        throw new Error("Either width or height must be provided to resize the image");
    }

    if (inputFileType === FileType.GIF && props.resizeGifs !== true) {
        // GIFs loose animation when resized
        return [file, inputFileType];
    }

    const imgBuffer = await file.arrayBuffer();
    const sharpInstance = sharp(imgBuffer);

    const resizedImgBuffer = await sharpInstance
        .webp()
        .resize({
            width: props.width,
            height: props.height,
            fit: props.fit,
            kernel: kernel,
            withoutEnlargement: props.withoutEnlargement === true,
        })
        .toArray();

    return [new File(resizedImgBuffer, "__resized-webp-img__"), FileType.WEBP];
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
