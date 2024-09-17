import * as fs from "node:fs/promises";
import { rm } from "node:fs/promises";
import { LOCAL_BASE_STORAGE_PATH } from "./utils";

export const doesPathExist = async (path: string) => {
    try {
        return await fs.exists(`${LOCAL_BASE_STORAGE_PATH}/${path}`);
    } catch (error) {
        return false;
    }
};

export const saveFileToLocalStorage = async (path: string, file: File) => {
    try {
        await Bun.write(`${LOCAL_BASE_STORAGE_PATH}/${path}`, file);
        return path;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getFileFromLocalStorage = async (path: string) => {
    try {
        const file = Bun.file(`${LOCAL_BASE_STORAGE_PATH}/${path}`);
        return file;
    } catch (error) {
        return null;
    }
};

export const deleteFromLocalStorage = async (path: string) => {
    try {
        await rm(`${LOCAL_BASE_STORAGE_PATH}/${path}`, { recursive: true });
        return path;
    } catch (error) {
        console.error(error);
        return null;
    }
};
