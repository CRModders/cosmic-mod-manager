import { STRING_ID_LENGTH } from "@app/utils/config";
import { nanoid } from "nanoid";

export function generateRandomId(len = STRING_ID_LENGTH) {
    return nanoid(len);
}

export function generateDbId() {
    return nanoid(STRING_ID_LENGTH);
}

export function parseJson<T extends object>(str: string | null): Promise<T | null> {
    return new Promise((resolve) => {
        try {
            if (str == null) resolve(str);
            else resolve(JSON.parse(str));
        } catch (error) {
            resolve(null);
        }
    });
}
