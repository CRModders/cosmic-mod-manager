import type { GlobalUserRole } from "..";

export interface UserProfileData {
    id: string;
    name: string | null;
    userName: string;
    role: GlobalUserRole;
    avatarUrl: string | null;
    bio: string | null;
    dateJoined: Date;
}
