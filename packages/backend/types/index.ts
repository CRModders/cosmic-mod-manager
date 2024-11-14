import type { User } from "@prisma/client";

export interface SessionDeviceDetails {
    os: {
        name: string;
        version?: string;
    };
    ipAddress: string;
    browser: string;
    city: string;
    country: string;
}

export interface ContextUserData extends User {
    sessionId: string;
}

export enum FILE_STORAGE_SERVICE {
    LOCAL = "local",
}
