export function isConfirmationCodeValid(dateCreated: Date, validity: number) {
    return Date.now() <= new Date(dateCreated).getTime() + validity;
}

export function isNumber(num: number | string) {
    if (typeof num === "number") {
        return num - num === 0;
    }
    return Number.isFinite(+num);
}
