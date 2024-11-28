export const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export function DateFromStr(date: string | Date) {
    try {
        return new Date(date);
    } catch (error) {
        return null;
    }
}

export function DateToISOStr(date: string | Date) {
    try {
        return new Date(date).toISOString();
    } catch (error) {
        return null;
    }
}
