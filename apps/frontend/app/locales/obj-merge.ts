// @ts-nocheck

export function fillEmptyKeys<T extends object>(obj: object, fallback: T): T {
    // Return the object as it is if the fallback itself is null or undefinded or not of object type
    if (!fallback || typeof fallback !== "object") return obj;
    const objKeys = Object.keys(fallback);

    // Loop over each key of the object
    for (const key of objKeys) {
        // If the fallback[key] value is an object type, recursively pass the value to this function
        if (typeof fallback[key] === "object") {
            if (obj[key] === undefined || obj[key] === null) obj[key] = {};
            obj[key] = fillEmptyKeys(obj[key], fallback[key]);
        }

        // If the value in the obj to be modified is null, set it equal to the value in the fallback
        else if (obj[key] === null || obj[key] === undefined) {
            obj[key] = fallback[key];
        }
    }

    // Return the modified object
    return obj;
}
