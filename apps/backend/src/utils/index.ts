export function isConfirmationCodeValid(dateCreated: Date, validity_ms: number) {
    return Date.now() <= new Date(dateCreated).getTime() + validity_ms;
}

export function isNumber(num: number | string) {
    if (typeof num === "number") {
        return num - num === 0;
    }
    return Number.isFinite(+num);
}
