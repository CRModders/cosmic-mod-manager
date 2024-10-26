import type { ConfirmationType } from "@shared/types";
import { generateRandomId } from "./str";

export const generateConfirmationEmailCode = (actionType: ConfirmationType, userId: string, length = 24) => {
    return `${actionType}-${userId}-${generateRandomId(length)}`;
};

export function isConfirmationCodeValid(dateCreated: Date, validity: number) {
    return Date.now() <= new Date(dateCreated).getTime() + validity;
}

export function isNumber(num: number | string) {
    if (typeof num === "number") {
        return num - num === 0;
    }
    return Number.isFinite(+num);
}
