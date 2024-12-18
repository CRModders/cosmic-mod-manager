import { STRING_ID_LENGTH } from "@app/utils/config";
import { nanoid } from "nanoid";

export function generateRandomId(len = STRING_ID_LENGTH) {
    return nanoid(len);
}

export function generateDbId() {
    return nanoid(STRING_ID_LENGTH);
}

export function tryJsonParse(str: string) {
    try {
        return JSON.parse(str);
    } catch (error) {
        return null;
    }
}
