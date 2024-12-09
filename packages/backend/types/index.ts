import type { User } from "@prisma/client";
import type { GlobalUserRole } from "@shared/types";

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
    role: GlobalUserRole;
}

export enum FILE_STORAGE_SERVICE {
    LOCAL = "local",
}
